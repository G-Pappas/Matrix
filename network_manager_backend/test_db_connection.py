from sqlalchemy import create_engine, text
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

print("Starting DB connection test...")
sys.stdout.flush()

# Get database configuration from environment variables with defaults
DB_USER = os.getenv('DB_USER', 'network_admin')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'strongpassword')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'network_db')

print(f"Attempting to connect to database with:")
print(f"User: {DB_USER}")
print(f"Host: {DB_HOST}")
print(f"Port: {DB_PORT}")
print(f"Database: {DB_NAME}")
sys.stdout.flush()

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful:", result.scalar())
        sys.stdout.flush()
except Exception as e:
    print("Connection failed:", e)
    sys.stdout.flush() 