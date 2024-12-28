#!/bin/bash

# Script Name: init-backend.sh
# Description: Initializes the NoteIt project backend

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
pip3 install -r requirements.txt

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

: '

-----------------------------------------------------------------------------------------------------------

# Exit immediately if a command fails
set -e

echo "Starting database initialization..."

# Variables
DB_NAME="ticketist"
DB_USER="user_teste"
DB_PASSWORD="teste"
TABLES_FILE="../database/create_tables.sql"
POPULATE_FILE="../database/populate.sql"
MARIADB_CONF="/etc/mysql/mariadb.conf.d/50-server.cnf"  # Default MariaDB configuration file

# Update and install necessary packages
echo "Updating packages and installing MariaDB..."
sudo apt update -y
sudo apt install -y mariadb-server

# Start MariaDB service
echo "Starting MariaDB service..."
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure MariaDB Installation
echo "Securing MariaDB installation..."
sudo mariadb-secure-installation <<EOF

y
$DB_PASSWORD
$DB_PASSWORD
y
y
y
y
EOF

# Configure MariaDB for remote access
echo "Configuring MariaDB for remote access..."
if [ -f "$MARIADB_CONF" ]; then
    sudo sed -i "s/^bind-address.*/bind-address = 0.0.0.0/" $MARIADB_CONF
    sudo systemctl restart mariadb
else
    echo "Error: MariaDB configuration file not found!"
    exit 1
fi

# Set up the database and user
echo "Setting up database and user..."
sudo mariadb -u root <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
FLUSH PRIVILEGES;
EOF

# Import table definitions
if [ -f "$TABLES_FILE" ]; then
    echo "Importing table definitions from $TABLES_FILE..."
    sudo mariadb -u $DB_USER -p$DB_PASSWORD $DB_NAME < $TABLES_FILE
else
    echo "Error: Tables file $TABLES_FILE not found!"
    exit 1
fi

# Restart MariaDB to apply changes
echo "Restarting MariaDB service..."
sudo systemctl restart mariadb

echo "Database initialization completed successfully."
'

