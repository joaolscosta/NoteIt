#!/bin/bash

# SQL file name
DB_FILE="db.sql"

# MariaDB configurations
DB_USER="root"
DB_PASSWORD="abc123"
DB_HOST="localhost"
DB_NAME="noteit_db"

# Update and install MariaDB if not installed
sudo apt update
sudo apt install -y mariadb-server mariadb-client

# Start and enable MariaDB service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Step 1: Check if MariaDB is running
echo "Checking if MariaDB is running..."
if ! systemctl is-active --quiet mariadb; then
    echo "MariaDB is not running. Starting MariaDB..."
    sudo systemctl start mariadb
fi

# Step 2: Check if the database already exists
echo "Checking if the database already exists..."
DB_EXISTS=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME")

if [ "$DB_EXISTS" ]; then
    echo "Database '$DB_NAME' already exists. Skipping creation."
else
    echo "Creating database and setting up tables..."
    mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" || exit 1
    mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$DB_FILE" || exit 1
    echo "Database setup completed successfully!"
fi

# Step 3: Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt || exit 1

# Step 4: Start the Flask API
echo "Starting Flask API..."
export FLASK_APP=app.py
flask run --host=0.0.0.0 || exit 1
