from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from bcrypt import hashpw, gensalt, checkpw
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
app.config['MYSQL_USER'] = os.getenv('DB_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('DB_NAME')

mysql = MySQL(app)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    user_data = request.json
    username = user_data.get('username')
    password = user_data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        cur.execute('SELECT COUNT(*) FROM users WHERE username = %s', (username,))
        user_exists = cur.fetchone()[0] > 0
        if user_exists:
            return jsonify({'message': 'User already exists'}), 409
        
        hashed_password = hashpw(password.encode('utf-8'), gensalt())
        
        cur.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, hashed_password))
        mysql.connection.commit()
        
        cur.close()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error registering user', 'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    user_data = request.json
    username = user_data.get('username')
    password = user_data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        cur.execute('SELECT password FROM users WHERE username = %s', (username,))
        result = cur.fetchone()
        
        if not result:
            return jsonify({'message': 'Invalid username or password'}), 401
        
        hashed_password = result[0].encode('utf-8')
        
        if checkpw(password.encode('utf-8'), hashed_password):
            cur.close()
            return jsonify({'message': 'Login successful'}), 200
        else:
            cur.close()
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
