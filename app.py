from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

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
        
        # Register user
        cur.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, password))
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
        cur.execute('SELECT * FROM users WHERE username = %s', (username,))
        user_exists = cur.fetchone()
        if not user_exists:
            return jsonify({'message': 'Username not found. Please register first.'}), 404
        
        # Check if username and password match
        cur.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, password))
        user = cur.fetchone()
        
        if user:
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500

    
# Existing endpoints for notes
@app.route('/notes', methods=['GET'])
def get_notes():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM notes')
    result = cur.fetchall()
    return jsonify(result)

@app.route('/notes', methods=['POST'])
def add_note():
    note_data = request.json
    cur = mysql.connection.cursor()
    cur.execute('INSERT INTO notes (title, content) VALUES (%s, %s)', (note_data['title'], note_data['content']))
    mysql.connection.commit()
    return jsonify({'message': 'Note added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
