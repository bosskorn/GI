import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import uuid

shipments = {}

class ShipmentHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def do_POST(self):
        if self.path == '/shipments':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            data = json.loads(body or b'{}')
            shipment_id = str(uuid.uuid4())
            shipment = {
                'id': shipment_id,
                'order_id': data.get('order_id'),
                'carrier': data.get('carrier'),
                'status': 'created'
            }
            shipments[shipment_id] = shipment
            self._set_headers(201)
            self.wfile.write(json.dumps(shipment).encode())
        else:
            self.send_error(404)

    def do_GET(self):
        if self.path.startswith('/shipments/'):
            shipment_id = self.path.split('/')[-1]
            shipment = shipments.get(shipment_id)
            if shipment:
                self._set_headers(200)
                self.wfile.write(json.dumps(shipment).encode())
            else:
                self.send_error(404, 'Shipment not found')
        else:
            self.send_error(404)

def run(host='127.0.0.1', port=8000):
    httpd = HTTPServer((host, port), ShipmentHandler)
    print(f"Serving on {host}:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
