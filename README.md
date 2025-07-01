# GI

This project contains a minimal shipping API implemented in Python.

## Setup

The source code lives in `src/` and does not rely on external
packages. Start the API server with:

```bash
python src/app.py
```

The server exposes the following endpoints:

- `POST /shipments` – create a shipment. Provide JSON with
  `{"order_id": "<id>", "carrier": "<name>"}`.
- `GET /shipments/<shipment_id>` – retrieve shipment details.

## Testing

Run the tests using `pytest`:

```bash
pytest
```

