import os
import sys
import json
import threading
import time
import urllib.request

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src import app


def start_server():
    server = app.HTTPServer(('127.0.0.1', 8001), app.ShipmentHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def test_create_and_get_shipment():
    server = start_server()
    time.sleep(0.1)

    data = json.dumps({'order_id': '1', 'carrier': 'UPS'}).encode()
    req = urllib.request.Request(
        'http://127.0.0.1:8001/shipments',
        data=data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 201
        body = json.load(resp)
        shipment_id = body['id']

    with urllib.request.urlopen(f'http://127.0.0.1:8001/shipments/{shipment_id}') as resp:
        assert resp.status == 200
        body = json.load(resp)
        assert body['order_id'] == '1'
        assert body['carrier'] == 'UPS'

    server.shutdown()
    server.server_close()
