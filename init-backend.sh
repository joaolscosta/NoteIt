#!/bin/bash

# Load environment variables from the .env file
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    export $(cat .env | xargs)
else
    echo ".env file not found. Please create one before running this script."
    exit 1
fi

# Update package list
echo "Updating system packages..."
sudo apt update

# Install necessary system dependencies
echo "Installing required system packages..."
sudo apt install -y python3.12 python3.12-venv python3.12-dev \
                    libmysqlclient-dev build-essential mysql-server

# Check if Python3 is installed
if ! command -v python3 &>/dev/null; then
    echo "Python3 installation failed. Please install Python manually."
    exit 1
fi

# Check if pip3 is installed
if ! command -v pip3 &>/dev/null; then
    echo "pip3 is not installed. Installing..."
    sudo apt install -y python3-pip
else
    echo "pip3 is already installed."
fi

# Check if MySQL is installed
if ! command -v mysql &>/dev/null; then
    echo "MySQL installation failed. Please install it manually."
    exit 1
else
    echo "MySQL is installed."
fi

# Check if the MySQL service is running
if ! systemctl is-active --quiet mysql; then
    echo "MySQL is not running. Starting MySQL..."
    sudo systemctl start mysql
    if ! systemctl is-active --quiet mysql; then
        echo "Failed to start MySQL. Please check your installation."
        exit 1
    fi
else
    echo "MySQL is already running."
fi

# Enable MySQL to start on boot
sudo systemctl enable mysql

# Setup Python environment and install dependencies
echo "Setting up Python environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

source venv/bin/activate

# Ensure Flask dependencies are installed
if [ -f requirements.txt ]; then
    echo "Installing Python dependencies from requirements.txt..."
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Skipping Python dependency installation."
fi

# Ensure flask-mysqldb is installed
echo "Installing flask-mysqldb..."
pip install flask-mysqldb

# Ensure the MySQL user and database exist
echo "Configuring MySQL user '${DB_USER}' and database '${DB_NAME}'..."
mysql -u root -p"${DB_ROOT_PASSWORD}" <<EOF
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
EOF

# Initialize the database schema
echo "Initializing the database schema..."
mysql -u "${DB_USER}" -p"${DB_PASSWORD}" ${DB_NAME} <<EOF
-- users table
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- tasks table
DROP TABLE IF EXISTS tasks;
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

-- folders table
CREATE TABLE IF NOT EXISTS folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- notes table
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    folder_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);
EOF

# Start the Flask server
echo "Starting the Flask server..."
export FLASK_APP=${FLASK_APP:-app.py}
export FLASK_ENV=${FLASK_ENV:-development}

if flask --version &>/dev/null; then
    flask run --host=0.0.0.0 --port=5000
else
    echo "Flask is not installed. Please check your setup."
    exit 1
fi
