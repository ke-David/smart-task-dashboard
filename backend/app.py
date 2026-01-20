from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = []

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_tasks():
    data = request.get_json()
    tasks.append(data)
    return jsonify(data), 201

if __name__ == "__main__":
    app.run(debug=True)
