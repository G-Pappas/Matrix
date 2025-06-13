from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeviceBase(BaseModel):
    name: str
    ip_address: str
    device_type: str

class DeviceCreate(DeviceBase):
    pass

class DeviceRead(DeviceBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 