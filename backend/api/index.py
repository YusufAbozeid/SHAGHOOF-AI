import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
root_dir = parent_dir if os.path.basename(parent_dir) != 'backend' else os.path.dirname(parent_dir)
backend_dir = os.path.join(root_dir, 'backend')

for path in [root_dir, backend_dir]:
    if path not in sys.path and os.path.exists(path):
        sys.path.insert(0, path)

try:
    from app.main import app
except Exception:
    try:
        from backend.app.main import app
    except Exception as e:
        from fastapi import FastAPI
        app = FastAPI()
        @app.get("/{full_path:path}")
        def err(full_path: str = ""):
            return {"status": "error", "message": str(e)}

app = app
