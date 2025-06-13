# Network Manager Backend API Manual
====================================

## Table of Contents
------------------
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [API Endpoints](#api-endpoints)
4. [Examples](#examples)
5. [Troubleshooting](#troubleshooting)

## Introduction
-------------
The Network Manager Backend API provides a RESTful interface for managing network devices. 
It allows you to create, read, update, and delete network devices in your system.

## Getting Started
---------------
1. Start the server:
   ```bash
   .\venv\Scripts\uvicorn.exe main:app --reload
   ```
2. Access the API documentation:
   - Open your browser and go to: http://127.0.0.1:8000/docs
   - This provides an interactive interface to test all endpoints

## API Endpoints
-------------

### 1. Create Device
---------------
**Endpoint:** `POST /devices/`

**Description:** Creates a new network device

**Request Body:**
```json
{
    "name": "Router-01",
    "ip_address": "192.168.1.1",
    "device_type": "router"
}
```

**Required Fields:**
- name (string)
- ip_address (string)
- device_type (string)

**Response:**
```json
{
    "id": 1,
    "name": "Router-01",
    "ip_address": "192.168.1.1",
    "device_type": "router",
    "created_at": "2024-03-14T12:00:00"
}
```

### 2. List Devices
---------------
**Endpoint:** `GET /devices/`

**Description:** Retrieves a list of all devices

**Query Parameters:**
- skip (integer, optional): Number of records to skip (default: 0)
- limit (integer, optional): Maximum number of records to return (default: 10)

**Response:**
```json
[
    {
        "id": 1,
        "name": "Router-01",
        "ip_address": "192.168.1.1",
        "device_type": "router",
        "created_at": "2024-03-14T12:00:00"
    },
    {
        "id": 2,
        "name": "Switch-01",
        "ip_address": "192.168.1.2",
        "device_type": "switch",
        "created_at": "2024-03-14T12:01:00"
    }
]
```

### 3. Get Single Device
-------------------
**Endpoint:** `GET /devices/{device_id}`

**Description:** Retrieves details of a specific device

**Path Parameters:**
- device_id (integer): ID of the device to retrieve

**Response:**
```json
{
    "id": 1,
    "name": "Router-01",
    "ip_address": "192.168.1.1",
    "device_type": "router",
    "created_at": "2024-03-14T12:00:00"
}
```

### 4. Update Device
---------------
**Endpoint:** `PUT /devices/{device_id}`

**Description:** Updates an existing device

**Path Parameters:**
- device_id (integer): ID of the device to update

**Request Body:**
```json
{
    "name": "Router-01-Updated",
    "ip_address": "192.168.1.1",
    "device_type": "router"
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Router-01-Updated",
    "ip_address": "192.168.1.1",
    "device_type": "router",
    "created_at": "2024-03-14T12:00:00"
}
```

### 5. Delete Device
---------------
**Endpoint:** `DELETE /devices/{device_id}`

**Description:** Deletes a device

**Path Parameters:**
- device_id (integer): ID of the device to delete

**Response:**
```json
{
    "id": 1,
    "name": "Router-01",
    "ip_address": "192.168.1.1",
    "device_type": "router",
    "created_at": "2024-03-14T12:00:00"
}
```

## Examples
---------

### Using curl

1. **Create a device:**
   ```bash
   curl -X POST "http://127.0.0.1:8000/devices/" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"Router-01\",\"ip_address\":\"192.168.1.1\",\"device_type\":\"router\"}"
   ```

2. **List all devices:**
   ```bash
   curl "http://127.0.0.1:8000/devices/"
   ```

3. **Get a specific device:**
   ```bash
   curl "http://127.0.0.1:8000/devices/1"
   ```

4. **Update a device:**
   ```bash
   curl -X PUT "http://127.0.0.1:8000/devices/1" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"Router-01-Updated\",\"ip_address\":\"192.168.1.1\",\"device_type\":\"router\"}"
   ```

5. **Delete a device:**
   ```bash
   curl -X DELETE "http://127.0.0.1:8000/devices/1"
   ```

### Using Python requests

```python
import requests

BASE_URL = "http://127.0.0.1:8000"

# Create a device
response = requests.post(
    f"{BASE_URL}/devices/",
    json={
        "name": "Router-01",
        "ip_address": "192.168.1.1",
        "device_type": "router"
    }
)
print(response.json())

# List all devices
response = requests.get(f"{BASE_URL}/devices/")
print(response.json())

# Get a specific device
response = requests.get(f"{BASE_URL}/devices/1")
print(response.json())

# Update a device
response = requests.put(
    f"{BASE_URL}/devices/1",
    json={
        "name": "Router-01-Updated",
        "ip_address": "192.168.1.1",
        "device_type": "router"
    }
)
print(response.json())

# Delete a device
response = requests.delete(f"{BASE_URL}/devices/1")
print(response.json())
```

## Troubleshooting
---------------

### Common Issues

1. **Server not starting**
   - Ensure PostgreSQL is running
   - Check database credentials in .env file
   - Verify all dependencies are installed

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check database user permissions
   - Confirm database exists

3. **404 Not Found**
   - Verify the device ID exists
   - Check the endpoint URL

4. **400 Bad Request**
   - Ensure all required fields are provided
   - Check data types of fields
   - Verify JSON format

### Error Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

### Getting Help

If you encounter any issues:
1. Check the error message
2. Verify your request format
3. Check the server logs
4. Visit the API documentation at http://127.0.0.1:8000/docs 