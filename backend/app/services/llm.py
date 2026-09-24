"""Unified resilient LLM service for SHAGHOOF AI.

Supports Groq, OpenAI, and Gemini with automatic model failover and pure Python
urllib fallback so it works reliably in any serverless environment without
dependency crashes.
"""
from __future__ import annotations

import json
import logging
import os
import re
import ssl
from typing import Any, Dict, List, Optional
from urllib.request import Request, urlopen

from ..core.config import settings

logger = logging.getLogger(__name__)

# Primary active models on Groq
GROQ_MODELS = [
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "allam-2-7b",
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]

GROQ_ARABIC_MODELS = [
    "allam-2-7b",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
]

OPENAI_MODELS = [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-3.5-turbo",
]


def _get_ssl_context():
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx
    except Exception:
        return None


def _post_json(url: str, headers: Dict[str, str], payload: Dict[str, Any], timeout: float = 30.0) -> Dict[str, Any]:
    """Robust HTTP POST helper trying httpx -> requests -> urllib."""
    data_bytes = json.dumps(payload).encode("utf-8")
    
    # 1. Try httpx
    try:
        import httpx
        with httpx.Client(timeout=timeout, verify=False) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                return resp.json()
            return {"error": {"message": resp.text, "status_code": resp.status_code}}
    except ImportError:
        pass
    except Exception as exc:
        logger.debug("httpx request failed: %s, falling back to urllib", exc)

    # 2. Try requests
    try:
        import requests
        resp = requests.post(url, headers=headers, json=payload, timeout=timeout, verify=False)
        if resp.status_code == 200:
            return resp.json()
        return {"error": {"message": resp.text, "status_code": resp.status_code}}
    except ImportError:
        pass
    except Exception as exc:
        logger.debug("requests call failed: %s, falling back to urllib", exc)

    # 3. Standard library urllib
    ctx = _get_ssl_context()
    req = Request(url, data=data_bytes, headers={**headers, "User-Agent": "SHAGHOOF-AI/3.0"})
    try:
        with urlopen(req, context=ctx, timeout=timeout) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except Exception as exc:
        msg = str(exc)
        if hasattr(exc, "read"):
            try:
                msg = exc.read().decode("utf-8")
            except Exception:
                pass
        return {"error": {"message": msg}}


def call_groq(messages: List[Dict[str, str]], model: Optional[str] = None,
              temperature: float = 0.3, max_tokens: int = 1024,
              json_mode: bool = False, is_arabic: bool = False) -> Optional[str]:
    """Call Groq API with automatic model failover."""
    key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
    if not key:
        return None

    candidate_models = []
    if model:
        candidate_models.append(model)
    configured_model = os.getenv("GROQ_MODEL") or getattr(settings, "GROQ_MODEL", None)
    if configured_model and configured_model not in candidate_models:
        candidate_models.append(configured_model)

    if is_arabic:
        for m in GROQ_ARABIC_MODELS:
            if m not in candidate_models:
                candidate_models.append(m)

    for m in GROQ_MODELS:
        if m not in candidate_models:
            candidate_models.append(m)

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    for m in candidate_models:
        payload: Dict[str, Any] = {
            "model": m,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        result = _post_json(url, headers, payload)
        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0].get("message", {}).get("content", "")
            if content:
                return content.strip()
        logger.debug("Groq model %s failed: %s", m, result.get("error"))

    return None


def call_openai(messages: List[Dict[str, str]], model: Optional[str] = None,
                temperature: float = 0.3, max_tokens: int = 1024,
                json_mode: bool = False) -> Optional[str]:
    """Call OpenAI API if key configured."""
    key = getattr(settings, "OPENAI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")
    if not key:
        return None

    model_name = model or getattr(settings, "OPENAI_MODEL", "") or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    payload: Dict[str, Any] = {
        "model": model_name,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    result = _post_json(url, headers, payload)
    if "choices" in result and len(result["choices"]) > 0:
        content = result["choices"][0].get("message", {}).get("content", "")
        if content:
            return content.strip()

    return None


def call_gemini(prompt: str) -> Optional[str]:
    """Fallback to Gemini service if available."""
    try:
        from . import gemini
        if gemini.ai_available():
            return gemini._generate(prompt)
    except Exception as exc:
        logger.debug("Gemini fallback failed: %s", exc)
    return None


def chat_generate(
    prompt: str,
    system: str = "",
    temperature: float = 0.3,
    max_tokens: int = 1024,
    json_mode: bool = False,
    is_arabic: bool = False,
    model: Optional[str] = None,
) -> Optional[str]:
    """Unified generator: tries Groq -> OpenAI -> Gemini in sequence."""
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    # 1. Try Groq
    out = call_groq(messages, model=model, temperature=temperature, max_tokens=max_tokens,
                    json_mode=json_mode, is_arabic=is_arabic)
    if out:
        return out

    # 2. Try OpenAI
    out = call_openai(messages, model=model, temperature=temperature, max_tokens=max_tokens,
                      json_mode=json_mode)
    if out:
        return out

    # 3. Try Gemini
    full_prompt = (f"{system}\n\n" if system else "") + prompt
    out = call_gemini(full_prompt)
    if out:
        return out

    return None


def ai_available() -> bool:
    """Return True if any AI provider (Groq, OpenAI, Gemini) is configured."""
    groq_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
    openai_key = getattr(settings, "OPENAI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")
    gemini_key = getattr(settings, "GEMINI_API_KEY", "") or os.getenv("GEMINI_API_KEY", "")
    return bool(groq_key or openai_key or gemini_key)


def get_providers_status() -> Dict[str, Any]:
    """Return detailed provider status for health checks."""
    groq_key = bool(settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", ""))
    openai_key = bool(getattr(settings, "OPENAI_API_KEY", "") or os.getenv("OPENAI_API_KEY", ""))
    gemini_key = bool(getattr(settings, "GEMINI_API_KEY", "") or os.getenv("GEMINI_API_KEY", ""))
    active = "groq" if groq_key else ("openai" if openai_key else ("gemini" if gemini_key else "none"))
    return {
        "ai_available": bool(groq_key or openai_key or gemini_key),
        "active_provider": active,
        "providers": {
            "groq": groq_key,
            "openai": openai_key,
            "gemini": gemini_key,
        },
    }


def safe_parse_json(text: str) -> Optional[Any]:
    """Extract and parse JSON object or array from LLM markdown fences."""
    if not text:
        return None
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    fence = re.search(r"```(?:json)?\s*(\[.*?\]|\{.*?\})\s*```", text, re.DOTALL)
    if fence:
        try:
            return json.loads(fence.group(1))
        except Exception:
            pass

    for opener, closer in (("[", "]"), ("{", "}")):
        start = text.find(opener)
        if start != -1:
            end = text.rfind(closer)
            if end > start:
                try:
                    return json.loads(text[start:end + 1])
                except Exception:
                    pass
    return None
