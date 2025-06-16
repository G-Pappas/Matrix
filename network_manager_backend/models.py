from sqlalchemy import Column, Integer, String, DateTime, func, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped

Base = declarative_base()

class DeviceType(Base):
    __tablename__ = 'device_types'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Device(Base):
    __tablename__ = 'devices'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ip_address = Column(String, nullable=False, unique=True)
    device_type = Column(String, nullable=False)
    tags: Mapped[list[str]] = Column(ARRAY(String), nullable=False, default=list, server_default='{}')
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 