from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

## DB SQLite

def init_db():
    conn = sqlite3.connect('backend/data/tasks.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            category TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/tasks', methods = ['GET'])
def get_tasks():
    conn = sqlite3.connect('backend/data/tasks.db')
    c = conn.cursor()
    c.execute('SELECT id, text, category FROM tasks')
    rows = c.fetchall()
    conn.close()

    tasks = [{'id': row[0], 'text': row[1], 'category': row[2]} for row in rows]
    return jsonify(tasks)

@app.route('/tasks', methods = ['POST'])
def add_task():
    data = request.get_json()
    text = data.get('text')
    category = data.get('category')

    conn = sqlite3.connect('backend/data/tasks.db')
    c = conn.cursor()
    c.execute('Insert into tasks (text, category) Values (?, ?)', (text, category)) #prevent SQL injection
    task_id = c.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'id': task_id, 'text': text, 'category': category}), 201    # OK, POST created a task

@app.route('/tasks/<int:task_id>', methods =['DELETE'])
def delete_task(task_id):
    conn = sqlite3.connect('backend/tasks.db')
    c = conn.cursor()
    c.execute('Delete From tasks Where id = ?', (task_id, ))    # (task_id, ) must be tuple, execute() expects a string + tuple or list
    if c.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Task not found'}), 404    # error, task ID not found
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task deleted'}), 200  # OK, DELETE success

##  JSON

# tasks = []    

# @app.route('/tasks', methods=['GET'])
# def get_tasks():
#     return jsonify(tasks)

# @app.route('/tasks', methods=['POST'])
# def add_tasks():
#     data = request.get_json()
#     tasks.append(data)
#     return jsonify(data), 201

if __name__ == "__main__":
    app.run(debug=True)
