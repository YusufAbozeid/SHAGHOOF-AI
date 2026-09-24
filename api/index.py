"""
Vercel Serverless Entry Point for SHAGHOOF AI Backend.
This module exposes the FastAPI app to Vercel's Python runtime.
"""
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, 'backend')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

try:
    from backend.app.main import app
except ImportError:
    from app.main import app

app = app
