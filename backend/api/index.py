from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

app_import_error = None
app_instance = None
try:
    from app.main import app as imported_app
    app_instance = imported_app
    app_status = "SUCCESS"
except Exception as e:
    app_status = "FAILED"
    app_import_error = traceback.format_exc()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response_data = {
            "status": "healthy",
            "app_status": app_status,
            "error": app_import_error,
            "routes": [getattr(r, "path", str(r)) for r in app_instance.routes] if app_instance else []
        }
        self.wfile.write(json.dumps(response_data, indent=2).encode('utf-8'))

app = app_instance or handler
