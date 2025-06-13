# Network Manager Backend

A backend service for managing network configurations and monitoring.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd network_manager_backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Configuration**

   Create a `.env` file in the project root directory with the following content:
   ```
   # Database Configuration
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=your_db_name
   ```

   Replace the values with your actual database credentials:
   - `DB_USER`: Database username
   - `DB_PASSWORD`: Database password
   - `DB_HOST`: Database host (use 'localhost' for local development)
   - `DB_PORT`: Database port (default is 5432)
   - `DB_NAME`: Database name

5. **Test Database Connection**
   ```bash
   python test_db_connection.py
   ```

## Development

- The project uses environment variables for configuration
- Never commit the `.env` file to version control
- Make sure to update the `.env` file with appropriate values for each environment (development, staging, production)

## Project Structure

```
network_manager_backend/
├── .env                    # Environment variables (not in version control)
├── .gitignore             # Git ignore file
├── requirements.txt       # Python dependencies
├── test_db_connection.py  # Database connection test
└── README.md             # This file
```

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Use strong passwords for database access
- In production, use environment variables provided by your hosting platform instead of `.env` file
- Regularly update dependencies to patch security vulnerabilities

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Add your license information here] 