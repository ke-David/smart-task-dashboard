from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

## DB SQLite

def init_db():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            position INTEGER DEFAULT 0
        );
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            category TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            board_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (board_id)
                REFERENCES boards(id)
                ON DELETE CASCADE
        );
    """)

    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect("backend/data/tasks.db")
    conn.row_factory = sqlite3.Row

    # i have to enable it every time a new connection starts in order to foreign key session start for cascade delete
    conn.execute("PRAGMA foreign_keys = ON;")

    return conn


@app.route("/home")
def tasks_page():
    return render_template("tasks.html")


@app.route("/analytics")
def analytics_page():
    return render_template("analytics.html")


@app.route('/tasks', methods = ['GET'])
def get_tasks():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT id, text, category, completed, board_id, created_at FROM tasks')
        rows = c.fetchall()
        conn.close()

        tasks = [{'id': row[0], 'text': row[1], 'category': row[2], 'completed': row[3], 'boardId': row[4], 'created_at': row[5]} for row in rows]

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
    boardId = data.get("boardId")

    if not text:
        return jsonify({"error": "Task text is empty"}), 400
    
    if not category:
        return jsonify({"error": "Category is required"}), 400
    
    if not boardId:
        return jsonify({"error": "BoardId is required"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('Insert into tasks (text, category, completed, board_id) Values (?, ?, ?, ?)', (text, category, 0, boardId)) #prevent SQL injection
        task_id = c.lastrowid
        conn.commit()
        conn.close()

        return jsonify({'id': task_id, 'text': text, 'category': category, 'completed': False, 'boardId': boardId}), 201   
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks/<int:task_id>', methods = ['PUT'])
def update_task(task_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if "completed" not in data:
        return jsonify({"error": "Missing completed status"}), 400
    

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
            return jsonify({'error': 'Task (id) not found'}), 404  
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task deleted'}), 200 
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        # to get how many tasks there are by category
        c.execute('Select category, Count(*) as count From tasks Group By category')
        rows = c.fetchall()
        
        tasks_by_category = {}
        for row in rows:
            tasks_by_category[row["category"]] = row["count"]
        
        # to get how many active vs completed tasks there are
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

        # to get timeline hero
        c.execute("""
            SELECT DATE(created_at) AS day, COUNT(*) AS count
            FROM tasks
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        """)

        timeline = [
            {"day": row[0], "count": row[1]}
            for row in c.fetchall()
        ]

        conn.close()

        return jsonify({
            "tasks_by_category": tasks_by_category,
            "completed_vs_active": completed_vs_active,
            "timeline": timeline
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/sum', methods=["GET"])
def get_summ(): 
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''SELECT COUNT(*) AS total,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN category = "Critical" AND completed = 0 THEN 1 ELSE 0 END) AS critical
            FROM tasks''')
        row = c.fetchone()     #there's only one row
        conn.close()

        total = row["total"] or 0
        completed = row["completed"] or 0
        active = row["active"] or 0
        critical = row["critical"] or 0

        completion_rate = round((completed / total) * 100, 1) if total else 0

        return jsonify({
            "total": total,
            "completed": completed,
            "active": active,
            "critical": critical,
            "completionRate": completion_rate
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/insights', methods=["GET"])
def get_insithts(): 
    try:
        conn = get_db_connection()
        c = conn.cursor()
        #board with the most active tasks
        c.execute('''
            SELECT boards.title, COUNT(tasks.id) AS active_count
            FROM tasks
            JOIN boards ON tasks.board_id = boards.id
            WHERE tasks.completed = 0
            GROUP BY boards.id
            ORDER BY active_count DESC
            LIMIT 1
        ''')
        row = c.fetchone()     #there's only one row
        heavy_board = row["title"] if row else None
        active_count = row["active_count"]

        # category with the most tasks, percentage of it; so which one is the most frequent/dominant category and what is its relative share
        c.execute('''
            SELECT category, 
                  COUNT(*) AS task_count, 
                  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks), 1) AS percentage
            FROM tasks
            GROUP BY category
            ORDER BY task_count DESC
            LIMIT 1
        ''')

        row = c.fetchone()     #there's only one row
        dominantCategory = row["category"] if row else None
        percentage = row["percentage"]

        # average tasks per board; "(t.id) * 1.0 " bc otherwise it will be integer, not float
        c.execute('''
            SELECT 
                ROUND(COUNT(t.id) * 1.0 / COUNT(DISTINCT b.id), 1) AS avg
            FROM boards b
            LEFT JOIN tasks t ON b.id = t.board_id;
        ''')

        #its the same, like the other avg, just different style
        # c.execute('''
        #     WITH stats AS (
        #         SELECT 
        #             COUNT(DISTINCT b.id) AS bid, 
        #             COUNT(t.id) AS tid
        #         FROM boards b
        #         LEFT JOIN tasks t ON b.id = t.board_id
        #     )
        #     SELECT bid, tid, ROUND(tid * 1.0 / bid, 1) AS avg FROM stats;
        # ''')

        row = c.fetchone()     
        avg = row["avg"] if row else None

        conn.close()

        return jsonify({
            "heavyBoard": heavy_board,
            "active_count": active_count,
            "dominantCategory": dominantCategory,
            "percentage": percentage,
            "avg": avg
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/boards", methods=["POST"])
def add_board():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Title required"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("INSERT INTO boards (title) VALUES (?)", (title,)) 
        id = c.lastrowid
        conn.commit()
        conn.close()

        return jsonify({'id': id, 'title': title}), 201  
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/boards", methods=["GET"])
def get_boards():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM boards ORDER BY id')
        rows = c.fetchall()
        conn.close()

        boards = [{'id': row[0], 'title': row[1], 'position': row[2]} for row in rows]

        return jsonify(boards)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/boardTasks", methods=["GET"])
def get_boards_with_tasks():
    try:
        conn = get_db_connection()
        c = conn.cursor()

        c.execute("""
            SELECT
                b.id   AS board_id,
                b.title,
                b.position,
                t.id   AS task_id,
                t.text,
                t.category,
                t.completed
            FROM boards b
            LEFT JOIN tasks t ON t.board_id = b.id
            ORDER BY b.id, t.id
        """)
        # left join bc there are empty boards as well
        rows = c.fetchall()
        conn.close()

        boards = {}
        for row in rows:
            board_id = row["board_id"]

            if board_id not in boards:
                boards[board_id] = {
                    "id": board_id,
                    "title": row["title"],
                    "position": row["position"],
                    "tasks": []
                }

            if row["task_id"] is not None:
                boards[board_id]["tasks"].append({
                    "id": row["task_id"],
                    "text": row["text"],
                    "category": row["category"],
                    "completed": row["completed"]
                })

        return jsonify(list(boards.values()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/boards/<int:board_id>", methods=["DELETE"])
def delete_board_with_tasks(board_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("DELETE FROM boards WHERE id = ?", (board_id,))
        if cur.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Board (id) not found'}), 404    # error, board ID not found
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task deleted'}), 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500



if __name__ == "__main__":
    init_db()
    app.run(debug=True)
