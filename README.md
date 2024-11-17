# NoteIt

NoteIt is a web application that allows users to register, log in, and create their own notes securely and organized. The project uses React for the frontend, Express for the backend, and MongoDB as the database.

This README.md will help you set up the project and understand its structure. Below you'll find instructions on how to run the project locally, understand the user authentication system, and other important features.

## Features

    User Authentication:
        Register new users.
        Secure login using bcrypt for password encryption.
    Personal Notes (coming soon):
        In a future version, each user will be able to store their notes privately.

## Technologies Used

    Frontend:
        React (For creating dynamic user interfaces)
        Axios (For making HTTP requests)
    Backend:
        Express (Web framework for Node.js)
        bcryptjs (For password encryption)
    Database:
        MongoDB (NoSQL database)

## How to Run the Project Locally

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <REPOSITORY_URL>
cd NoteIt
```

### 2. Set Up the Backend

Inside the backend folder, install the dependencies:

```bash
cd backend
npm install
```

Set Up the Database:

Make sure you have MongoDB installed and running locally, or use a cloud-based database service. The database used is MongoDB, and the connection string is set in the config/db.js file.

The default connection string is:

```bash
await mongoose.connect("mongodb://localhost:27017/NoteIt");
```

If you're using a cloud database, replace this URL with the appropriate connection string.

To start the backend server:

```bash
npm start
```

The backend will run on http://localhost:5000 by default.

### 3. Set Up the Frontend

Inside the frontend folder, install the project dependencies:

```bash
cd frontend
npm install
```

To start the React development server:

```bash
npm start
```

The frontend will run on http://localhost:3000 by default.

### 4. Environment Variables

In the frontend, you can configure the backend API URL in a .env file:

```bash
REACT_APP_API_URL=http://localhost:5000
```

In the backend, the database configuration is in config/db.js, where you can change the MongoDB URL as needed.

### 5. Testing the Application

    Go to http://localhost:3000 in your browser.
    Register a new user.
    Log in with the email and password you created.
    (Future feature) Create and manage your personal notes.

## Project Structure

```bash
NoteIt/
├── backend/
│ ├── config/
│ │ └── db.js # Database configuration
│ ├── models/
│ │ └── User.js # User model
│ ├── routes/
│ │ └── userRoutes.js # User authentication routes
│ ├── server.js # Main backend server file
│ └── package.json # Backend dependencies and scripts
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ └── Login.js # Login and Register component
│ │ ├── App.js # Main frontend component
│ │ └── index.js # React entry point
│ └── package.json # Frontend dependencies and scripts
└── README.md # This file
```

This project is licensed under the MIT License.
