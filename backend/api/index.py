"""
Vercel Serverless Entry Point for SHAGHOOF AI Backend.
This module exposes the FastAPI app to Vercel's Python runtime.
"""
import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app as real_app
    app = real_app
except Exception as e:
    tb = traceback.format_exc()
    app = FastAPI()
    
    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    def catch_err(full_path: str = ""):
        return JSONResponse(status_code=200, content={
            "status": "fatal_init_error",
            "error": str(e),
            "traceback": tb.split("\n"),
            "backend_dir": backend_dir,
            "sys_path": sys.path,
            "files_in_backend": os.listdir(backend_dir) if os.path.exists(backend_dir) else []
        })

handler = app
