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
    from app.main import app
except Exception as e:
    tb = traceback.format_exc()
    app = FastAPI(title="Shaghoof Error Handler")

    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    def catch_err(full_path: str = ""):
        return JSONResponse(status_code=500, content={
            "status": "init_error",
            "error": str(e),
            "traceback": tb.split("\n")
        })

handler = app
