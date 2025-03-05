from flask import Flask, request, jsonify, session
from flask_mysql_connector import MySQL
from flask_session import Session
from flask_cors import CORS
from bcrypt import hashpw, gensalt, checkpw
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
app.config['MYSQL_USER'] = os.getenv('DB_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['MYSQL_DATABASE'] = os.getenv('DB_NAME')

# Session Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = os.getenv('SESSION_TYPE')
app.config['SESSION_PERMANENT'] = os.getenv('SESSION_PERMANENT') == 'True'
app.config['SESSION_COOKIE_HTTPONLY'] = os.getenv('SESSION_COOKIE_HTTPONLY') == 'True'
app.config['SESSION_COOKIE_SECURE'] = os.getenv('SESSION_COOKIE_SECURE') == 'True'

mysql = MySQL(app)
CORS(app, resources={r"/*": {"origins": "*"}})
Session(app)

# Auxiliar function to check login status
def require_login():
    if 'username' not in session:
        return jsonify({'message': 'Unauthorized access'}), 401

# --------------------------------------- User Routes ---------------------------------------

# Register
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

# Login
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
            session['username'] = username
            cur.close()
            return jsonify({'message': 'Login successful'}), 200
        else:
            cur.close()
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200

# --------------------------------------- Task Routes ---------------------------------------

# Add a task
@app.route('/addtask', methods=['POST'])
def add_task():
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']
    task_data = request.json
    task_text = task_data.get('task_text')
    
    if not task_text:
        return jsonify({'message': 'Task is required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        cur.execute('INSERT INTO tasks (task, username) VALUES (%s, %s)', (task_text, username))
        mysql.connection.commit()
        
        cur.close()

        return jsonify({'message': 'Task added successfully'}), 201
    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error adding task', 'error': str(e)}), 500

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']

    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT id, task, completed FROM tasks WHERE username = %s', (username,))
        tasks = [{'id': row[0], 'task': row[1], 'completed': row[2]} for row in cur.fetchall()]
        cur.close()
        return jsonify({'tasks': tasks}), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching tasks', 'error': str(e)}), 500

# Mark task as complete
@app.route('/complete_task', methods=['POST'])
def toggle_task_completion():
    auth_check = require_login()
    if auth_check:
        return auth_check

    task_data = request.json
    task_id = task_data.get('task_id')

    if not task_id:
        return jsonify({'message': 'Task ID is required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        cur.execute('SELECT completed FROM tasks WHERE id = %s', (task_id,))
        task = cur.fetchone()
        if not task:
            return jsonify({'message': 'Task not found'}), 404
        
        new_status = not task[0]
        
        cur.execute('UPDATE tasks SET completed = %s WHERE id = %s', (new_status, task_id))
        mysql.connection.commit()
        
        cur.close()
        
        return jsonify({'message': 'Task updated successfully', 'completed': new_status}), 200
    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error updating task', 'error': str(e)}), 500

# Delete a task
@app.route('/delete_task', methods=['POST'])
def delete_task():
    auth_check = require_login()
    if auth_check:
        return auth_check

    task_data = request.json
    task_id = task_data.get('task_id')

    if not task_id:
        return jsonify({'message': 'Task ID is required'}), 400

    try:
        cur = mysql.connection.cursor()
        
        cur.execute('SELECT * FROM tasks WHERE id = %s', (task_id,))
        task = cur.fetchone()
        
        if not task:
            return jsonify({'message': 'Task not found'}), 404
        
        cur.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
        mysql.connection.commit()
        
        cur.close()
        
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error deleting task', 'error': str(e)}), 500

# --------------------------------------- Folders ---------------------------------------

# Add a folder
@app.route('/create_folder', methods=['POST'])
def create_folder():
    auth_check = require_login()
    if auth_check:
        return auth_check

    data = request.json
    username = session['username']
    folder_name = data.get('folder_name')
    parent_id = data.get('parent_id', None)

    if not folder_name:
        return jsonify({'message': 'Folder name is required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            'INSERT INTO folders (name, username, parent_id) VALUES (%s, %s, %s)',
            (folder_name, username, parent_id)
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Folder created successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error creating folder', 'error': str(e)}), 500

# Get folders
@app.route('/get_folders', methods=['GET'])
def get_folders():
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']
    parent_id = request.args.get('parent_id', None)

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            'SELECT id, name FROM folders WHERE username = %s AND parent_id <=> %s',
            (username, parent_id)
        )
        folders = [{'id': row[0], 'name': row[1]} for row in cur.fetchall()]
        cur.close()
        return jsonify({'folders': folders}), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching folders', 'error': str(e)}), 500

# --------------------------------------- Notes ---------------------------------------

# Add a note
@app.route('/add_note', methods=['POST'])
def add_note():
    
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']
    
    data = request.json
    username = data.get('username')
    folder_id = data.get('folder_id')
    note_title = data.get('note_title')
    note_text = data.get('note_text')

    if not username or not folder_id or not note_text or not note_title:
        return jsonify({'message': 'Username, folder_id, note_title, and note_text are required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            'INSERT INTO notes (title, text, username, folder_id) VALUES (%s, %s, %s, %s)',
            (note_title, note_text, username, folder_id)
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Note added successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error adding note', 'error': str(e)}), 500

# Get notes
@app.route('/get_notes', methods=['GET'])
def get_notes():
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']
    
    folder_id = request.args.get('folder_id')

    if not username:
        return jsonify({'message': 'Username is required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            'SELECT id, title, text FROM notes WHERE username = %s AND folder_id = %s',
            (username, folder_id)
        )
        notes = [{'id': row[0], 'title': row[1], 'text': row[2]} for row in cur.fetchall()]
        cur.close()
        return jsonify({'notes': notes}), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching notes', 'error': str(e)}), 500

# Update a note
@app.route('/update_note', methods=['POST'])
def update_note():
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']
    
    data = request.json
    note_id = data.get('note_id')
    note_title = data.get('note_title')
    note_text = data.get('note_text')

    if not note_id or not note_title or not note_text or not username:
        return jsonify({'message': 'Note ID, title, text, and username are required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            'UPDATE notes SET title = %s, text = %s WHERE id = %s AND username = %s',
            (note_title, note_text, note_id, username)
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Note updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error updating note', 'error': str(e)}), 500

# Delete a note
@app.route('/delete_note', methods=['POST'])
def delete_note():
    auth_check = require_login()
    if auth_check:
        return auth_check

    data = request.json
    note_id = data.get('note_id')

    if not note_id:
        return jsonify({'message': 'Note ID is required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM notes WHERE id = %s', (note_id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Note deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error deleting note', 'error': str(e)}), 500

# --------------------------------------- User settings ---------------------------------------

# Update user settings
@app.route('/update-user', methods=['PUT'])
def update_user():
    auth_check = require_login()
    if auth_check:
        return auth_check

    username = session['username']
    
    data = request.json
    current_username = data.get('currentUsername')
    new_username = data.get('newUsername')
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_username or not current_password:
        return jsonify({'message': 'Current username and password are required'}), 400

    try:
        cur = mysql.connection.cursor()

        # Verify current password
        cur.execute('SELECT password FROM users WHERE username = %s', (current_username,))
        user = cur.fetchone()
        if not user or not checkpw(current_password.encode('utf-8'), user[0].encode('utf-8')):
            return jsonify({'message': 'Invalid current password'}), 401

        # Check if new username already exists (if changing username)
        if new_username and new_username != current_username:
            cur.execute('SELECT COUNT(*) FROM users WHERE username = %s', (new_username,))
            if cur.fetchone()[0] > 0:
                return jsonify({'message': 'Username already exists'}), 409

        # Update username in all related tables
        if new_username and new_username != current_username:
            # Update username in users table
            cur.execute('UPDATE users SET username = %s WHERE username = %s', 
                       (new_username, current_username))
            
            # Update username in tasks table
            cur.execute('UPDATE tasks SET username = %s WHERE username = %s', 
                       (new_username, current_username))
            
            # Update username in folders table
            cur.execute('UPDATE folders SET username = %s WHERE username = %s', 
                       (new_username, current_username))
            
            # Update username in notes table
            cur.execute('UPDATE notes SET username = %s WHERE username = %s', 
                       (new_username, current_username))

        # Update password if provided
        if new_password and new_password != current_password:
            hashed_password = hashpw(new_password.encode('utf-8'), gensalt())
            cur.execute('UPDATE users SET password = %s WHERE username = %s', 
                       (hashed_password, new_username or current_username))

        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'User settings updated successfully'}), 200

    except Exception as e:
        cur.close()
        return jsonify({'message': 'Error updating user settings', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
