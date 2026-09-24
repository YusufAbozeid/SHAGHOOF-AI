"""
Vercel Serverless Entry Point for SHAGHOOF AI Backend.
Exposes the FastAPI app to Vercel's Python runtime with fail-safe error reporting.
"""
import sys
import os
import traceback
from fastapi import FastAPI

api_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(api_dir)
backend_dir = os.path.join(root_dir, 'backend')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

try:
    from app.main import app as main_app
    app = main_app
except Exception as e:
    err_msg = str(e)
    err_tb = traceback.format_exc()
    
    app = FastAPI(title="Shaghoof Error Handler")
    
    @app.get("/{full_path:path}")
    def catch_all(full_path: str = ""):
        return {
            "status": "error",
            "error": err_msg,
            "traceback": err_tb.split("\n"),
            "sys_path": sys.path,
        }
