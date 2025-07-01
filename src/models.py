from dataclasses import dataclass

@dataclass
class Order:
    id: str
    description: str

@dataclass
class Carrier:
    name: str

@dataclass
class Shipment:
    id: str
    order_id: str
    carrier: str
    status: str = "created"
