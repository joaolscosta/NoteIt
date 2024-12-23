#!/bin/bash

# Exit script on any error
set -e

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

echo "Starting setup..."

# Step 1: Update package lists
echo "Updating package lists..."
sudo apt update -y

# Step 2: Install Node.js and npm if not already installed
if command_exists node && command_exists npm; then
    echo "Node.js and npm are already installed."
else
    echo "Installing Node.js and npm..."
    sudo apt install -y nodejs npm
fi

cd frontend/

# Step 4: Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Step 5: Run the frontend development server
echo "Starting the frontend development server..."
npm run dev

echo "Frontend setup complete!"
