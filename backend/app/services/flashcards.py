from __future__ import annotations
import os
import json
import logging
from typing import Optional

from ..core.config import settings

logger = logging.getLogger(__name__)

try:
    from groq import Groq
except ImportError:
    Groq = None  # type: ignore[assignment,misc]


def generate_flashcards(
    topic: str,
    n: int = 8,
    weak_topics: Optional[list[str]] = None,
    api_key: Optional[str] = None,
) -> list[dict]:
    topic = (topic or "").strip()
    if not topic:
        raise ValueError("`topic` must be a non-empty string.")
    n = max(1, min(int(n), 30))

    key = api_key or settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
    if not key or Groq is None:
        return [{"front": topic, "back": f"Study material for {topic}."}]

    focus = ""
    if weak_topics:
        focus = f"\nPay extra attention to: {', '.join(weak_topics)}."

    prompt = f"""Generate exactly {n} flashcards for: '{topic}'.{focus}

CRITICAL: Interpret topics strictly within AI / Computer Science / Software Engineering.
Return JSON: {{"cards": [{{"front": "...", "back": "..."}}, ...]}}
"""
    try:
        from . import llm
        system = (
            "You are an expert educational tutor. "
            "Respond strictly with valid JSON in this format: "
            '{"cards": [{"front": "question/term", "back": "answer/definition"}]}'
        )
        raw = llm.chat_generate(prompt, system=system, temperature=0.2, max_tokens=2000, json_mode=True)
        if raw:
            data = llm.safe_parse_json(raw) or {}
            cards = [c for c in data.get("cards", []) if isinstance(c, dict) and "front" in c and "back" in c]
            if cards:
                return cards[:n]
    except Exception as exc:
        logger.warning("Unified LLM flashcard generation failed: %s", exc)

    return [{"front": topic, "back": f"Study material and key concepts for {topic}."}]
