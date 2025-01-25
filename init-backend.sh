#!/bin/bash

# Script Name: init-backend.sh
# Description: Initializes the NoteIt project backend

#! In case of error: $ sudo mysql_secure_installation

# Check if Python3 is installed
if ! command -v python3 &>/dev/null; then
    echo "Python3 is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y python3
else
    echo "Python3 is already installed."
fi

# Check if pip3 is installed
if ! command -v pip3 &>/dev/null; then
    echo "pip3 is not installed. Installing..."
    sudo apt-get install -y python3-pip
else
    echo "pip3 is already installed."
fi

# Check if MariaDB is installed
if ! command -v mysql &>/dev/null; then
    echo "MariaDB is not installed. Installing..."
    sudo apt-get install -y mariadb-server mariadb-client
else
    echo "MariaDB is already installed."
fi

# Check if MariaDB service is running
if ! systemctl is-active --quiet mariadb; then
    echo "MariaDB is not running. Starting MariaDB..."
    sudo systemctl start mariadb
    if ! systemctl is-active --quiet mariadb; then
        echo "Failed to start MariaDB. Please check your MariaDB installation."
        exit 1
    fi
else
    echo "MariaDB is already running."
fi

# Enable MariaDB to start on boot
sudo systemctl enable mariadb

# Install Python project dependencies
echo "Installing Python dependencies..."
sudo apt install python3-flask
if [ -f requirements.txt ]; then
    pip3 install -r requirements.txt
else
    echo "requirements.txt not found, skipping Python dependency installation."
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
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS users;
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
