from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            import fastapi
            fastapi_ver = fastapi.__version__
        except Exception as e:
            fastapi_ver = f"Error: {e}"

        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if backend_dir not in sys.path:
            sys.path.insert(0, backend_dir)

        app_err = None
        try:
            from app.main import app
            app_status = "Successfully imported app.main"
        except Exception as e:
            app_status = "Failed to import app.main"
            app_err = traceback.format_exc()

        body = {
            "status": "ok",
            "fastapi_version": fastapi_ver,
            "app_status": app_status,
            "app_error": app_err,
            "python_version": sys.version,
            "cwd": os.getcwd(),
            "sys_path": sys.path,
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(body, indent=2).encode('utf-8'))
