#!/bin/bash

# Script Name: init-backend.sh
# Description: Initializes the NoteIt project backend

# Check if Python is installed
if ! command -v python3 &>/dev/null; then
    echo "Python3 is not installed. Please install Python3 before proceeding."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &>/dev/null; then
    echo "pip3 is not installed. Please install pip3 before proceeding."
    exit 1
fi

# Install project dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Check if MariaDB is running
if ! systemctl is-active --quiet mariadb; then
    echo "MariaDB is not running. Starting MariaDB..."
    sudo systemctl start mariadb
    if ! systemctl is-active --quiet mariadb; then
        echo "Failed to start MariaDB. Please check your MariaDB installation."
        exit 1
    fi
fi

# Ensure the MariaDB user 'joao' exists
echo "Ensuring MariaDB user 'joao' exists..."
mysql -u root -p <<EOF
CREATE USER IF NOT EXISTS 'joao'@'localhost' IDENTIFIED BY 'abc123';
GRANT ALL PRIVILEGES ON *.* TO 'joao'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

# Database initialization
echo "Initializing the database..."
mysql -u joao -pabc123 <<EOF
CREATE DATABASE IF NOT EXISTS noteit_db;
USE noteit_db;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);
EOF

# Start the Flask server
echo "Starting the Flask server..."
export FLASK_APP=app.py
export FLASK_ENV=development
python3 -m flask run
