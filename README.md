# Matrix Network Manager

A full-stack application for managing network devices, built with FastAPI and React.

## Features

- Add, edit, and delete network devices
- View device details and history
- Real-time device status monitoring
- User-friendly interface

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Python 3.8+

### Frontend
- React
- TypeScript
- Material-UI
- Axios

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd network_manager_backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
.\venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a .env file with your database configuration:
```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=network_db
```

6. Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd network_manager_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 