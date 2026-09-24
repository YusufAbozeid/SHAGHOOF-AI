"""
Vercel Serverless Entry Point for SHAGHOOF AI Backend.
This module exposes the FastAPI app to Vercel's Python runtime.
"""
import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
