from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DeviceTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class DeviceTypeCreate(DeviceTypeBase):
    pass

class DeviceTypeRead(DeviceTypeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

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