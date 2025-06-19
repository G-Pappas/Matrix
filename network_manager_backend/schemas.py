from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DeviceBase(BaseModel):
    name: str
    ip_address: str
    device_type: str
    tags: List[str] = []

class DeviceCreate(DeviceBase):
    pass

class DeviceRead(DeviceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DeviceTypeCreate(BaseModel):
    name: str
    description: Optional[str] = None

class DeviceTypeRead(DeviceTypeCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 