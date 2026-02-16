from flask import Flask, jsonify, request, render_template
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
            category TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect("backend/data/tasks.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/tasks', methods = ['GET'])
def get_tasks():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT id, text, category, completed FROM tasks')
        rows = c.fetchall()
        conn.close()

        # tasks = []
        # for row in c.fetchall():
        #     task = {
        #         'id': row[0],
        #         'text': row[1],
        #         'category': row[2],
        #         'completed': row[3]
        #     }
        #     tasks.append(task)

        tasks = [{'id': row[0], 'text': row[1], 'category': row[2], 'completed': row[3]} for row in rows]

        return jsonify(tasks)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks', methods = ['POST'])
def add_task():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    text = data.get("text", "").strip()
    category = data.get("category", "").strip()

    if not text:
        return jsonify({"error": "Task text is empty"}), 400
    
    if not category:
        return jsonify({"error": "Category is required"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('Insert into tasks (text, category, completed) Values (?, ?, ?)', (text, category, 0)) #prevent SQL injection
        task_id = c.lastrowid
        conn.commit()
        conn.close()

        return jsonify({'id': task_id, 'text': text, 'category': category, 'completed': False}), 201    # OK, POST created a task
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks/<int:task_id>', methods = ['PUT'])
def update_task(task_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if "completed" not in data:
        return jsonify({"error": "Missing completed status"}), 400
    
    # if not data or "completed" not in data:
    #     return jsonify({"error": "Missing completed field"}), 400

    #    completed = 1 if data["completed"] else 0

    if data["completed"]:
        completed = 1  
    else: 
        completed = 0

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('Update tasks Set completed = ? where id = ?', (completed, task_id)) #prevent SQL injection
        if c.rowcount == 0:
                conn.close()
                return jsonify({"error": "Task not found"}), 404
        conn.commit()
        conn.close()

        return jsonify({"message": "Task updated"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks/<int:task_id>', methods =['DELETE'])
def delete_task(task_id):
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('Delete From tasks Where id = ?', (task_id, ))    # (task_id, ) must be tuple, execute() expects a string + tuple or list
        if c.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404    # error, task ID not found
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task deleted'}), 200  # OK, DELETE success
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('Select category, Count(*) as count From tasks Group By category')
        rows = c.fetchall()
        
        # to show how many tasks there are per category
        # tasks_by_category = {row["category"]: row["count"] for row in rows}    #or row[0] and row[1]
        # tasks_by_category = []
        # for row in rows:
            # task = {
            #     row[0]: row[1],
            # }
            # tasks_by_category.append(task)    # wrong because beckend should NOT send an array back, but an object

        tasks_by_category = {}
        for row in rows:
            tasks_by_category[row["category"]] = row["count"]
        
        # to show how many active vs completed tasks there are
        c.execute('Select completed, Count(*) as count From tasks Group By completed')
        rows = c.fetchall()
        completed_vs_active = {
            "completed":  0,
            "active": 0
        }
        for row in rows:
            if row[0] == 1:
                completed_vs_active['completed'] = row[1]
            else:
                completed_vs_active['active'] = row[1]

        conn.close()

        return jsonify({
            "tasks_by_category": tasks_by_category,
            "completed_vs_active": completed_vs_active
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    




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
    init_db()
    app.run(debug=True)
