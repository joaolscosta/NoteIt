from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from bcrypt import hashpw, gensalt, checkpw

app = Flask(__name__)

# MariaDB Database Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'joao'
app.config['MYSQL_PASSWORD'] = 'abc123'
app.config['MYSQL_DB'] = 'noteit_db'

mysql = MySQL(app)
CORS(app)

# Endpoint to register a new user
@app.route('/register', methods=['POST'])
def register():
    user_data = request.json
    username = user_data.get('username')
    password = user_data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        # Check if user already exists
        cur.execute('SELECT COUNT(*) FROM users WHERE username = %s', (username,))
        user_exists = cur.fetchone()[0] > 0
        if user_exists:
            return jsonify({'message': 'User already exists'}), 409
        
        # Hash password before storing it
        hashed_password = hashpw(password.encode('utf-8'), gensalt())
        
        # Register user
        cur.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, hashed_password))
        mysql.connection.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error registering user', 'error': str(e)}), 500

# Endpoint to login
@app.route('/login', methods=['POST'])
def login():
    user_data = request.json
    username = user_data.get('username')
    password = user_data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        # Check if username exists
        cur.execute('SELECT password FROM users WHERE username = %s', (username,))
        result = cur.fetchone()
        
        if not result:
            return jsonify({'message': 'Invalid username or password'}), 401
        
        hashed_password = result[0].encode('utf-8')
        
        # Verify password
        if checkpw(password.encode('utf-8'), hashed_password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500

# Endpoint to get all notes
@app.route('/notes', methods=['GET'])
def get_notes():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT id, title, content FROM notes')
        result = cur.fetchall()
        notes = [{'id': note[0], 'title': note[1], 'content': note[2]} for note in result]
        return jsonify(notes), 200
    except Exception as e:
        return jsonify({'message': 'Error retrieving notes', 'error': str(e)}), 500

# Endpoint to add a new note
@app.route('/notes', methods=['POST'])
def add_note():
    note_data = request.json
    title = note_data.get('title')
    content = note_data.get('content')

    if not title or not content:
        return jsonify({'message': 'Title and content are required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute('INSERT INTO notes (title, content) VALUES (%s, %s)', (title, content))
        mysql.connection.commit()
        return jsonify({'message': 'Note added successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error adding note', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
