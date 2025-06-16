from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv
from models import Base, Device, DeviceType
from schemas import DeviceCreate, DeviceRead, DeviceTypeCreate, DeviceTypeRead
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

DB_USER = os.getenv('DB_USER', 'network_admin')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'strongpassword')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'network_db')

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Network Manager Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status": "ok"}

# CRUD endpoints for Device
@app.post("/devices/", response_model=DeviceRead)
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    db_device = Device(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@app.get("/devices/", response_model=List[DeviceRead])
def read_devices(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    devices = db.query(Device).offset(skip).limit(limit).all()
    print("Devices from database:", [{"id": d.id, "name": d.name, "ip_address": d.ip_address, "device_type": d.device_type} for d in devices])
    return devices

@app.get("/devices/{device_id}", response_model=DeviceRead)
def read_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@app.put("/devices/{device_id}", response_model=DeviceRead)
def update_device(device_id: int, device: DeviceCreate, db: Session = Depends(get_db)):
    db_device = db.query(Device).filter(Device.id == device_id).first()
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    for key, value in device.dict().items():
        setattr(db_device, key, value)
    db.commit()
    db.refresh(db_device)
    return db_device

@app.delete("/devices/{device_id}", response_model=DeviceRead)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    db_device = db.query(Device).filter(Device.id == device_id).first()
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(db_device)
    db.commit()
    return db_device

# Device Type endpoints
@app.post("/device-types/", response_model=DeviceTypeRead)
def create_device_type(device_type: DeviceTypeCreate, db: Session = Depends(get_db)):
    db_device_type = DeviceType(**device_type.dict())
    try:
        db.add(db_device_type)
        db.commit()
        db.refresh(db_device_type)
        return db_device_type
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Device type already exists")

@app.get("/device-types/", response_model=List[DeviceTypeRead])
def read_device_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    device_types = db.query(DeviceType).offset(skip).limit(limit).all()
    return device_types

@app.get("/device-types/{device_type_id}", response_model=DeviceTypeRead)
def read_device_type(device_type_id: int, db: Session = Depends(get_db)):
    device_type = db.query(DeviceType).filter(DeviceType.id == device_type_id).first()
    if device_type is None:
        raise HTTPException(status_code=404, detail="Device type not found")
    return device_type

@app.put("/device-types/{device_type_id}", response_model=DeviceTypeRead)
def update_device_type(device_type_id: int, device_type: DeviceTypeCreate, db: Session = Depends(get_db)):
    db_device_type = db.query(DeviceType).filter(DeviceType.id == device_type_id).first()
    if db_device_type is None:
        raise HTTPException(status_code=404, detail="Device type not found")
    
    for key, value in device_type.dict().items():
        setattr(db_device_type, key, value)
    
    try:
        db.commit()
        db.refresh(db_device_type)
        return db_device_type
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Device type already exists")

@app.delete("/device-types/{device_type_id}")
def delete_device_type(device_type_id: int, db: Session = Depends(get_db)):
    db_device_type = db.query(DeviceType).filter(DeviceType.id == device_type_id).first()
    if db_device_type is None:
        raise HTTPException(status_code=404, detail="Device type not found")
    
    # Check if any devices are using this type
    devices_using_type = db.query(Device).filter(Device.device_type == db_device_type.name).first()
    if devices_using_type:
        raise HTTPException(status_code=400, detail="Cannot delete device type that is in use")
    
    db.delete(db_device_type)
    db.commit()
    return {"message": "Device type deleted successfully"} 