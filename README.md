# Smart Task Dashboard

A lightweight web app for managing tasks and visualizing productivity insights.

This project was built to refresh and demonstrate end-to-end software development skills expected from a junior full-stack / backend / frontend developer: API design, database modeling, frontend rendering, and analytics visualization — all in one coherent app


## What the App Does

- Manage tasks across multiple boards
- Track task status (active vs completed)
- Categorize tasks by importance
- Persist data using a relational database
- Visualize task analytics in a modern dashboard

The application includes a Trello-like task page (Boards view) and a dedicated analytics page (Insights and trends view).


## Project Goals

- Refresh and apply core IT BSc knowledge in a realistic project
- Practice frontend ↔ backend communication
- Design a small but complete REST API
- Work with relational databases, SQL aggregations and analytics
- Apply Git and GitHub workflows and project structure practices


## Technologies Used

### Frontend
- HTML
- CSS (modern layout, card-based UI, glassmorphism)
- JavaScript (ES modules)
- Chart.js (analytics data visualization)

### Backend
- Python
- Flask (REST API)

### Database
- SQLite (relational schema with foreign keys and cascade delete)

### Development & Tools
- Git & GitHub
- REST APIs
- Virtual environments (venv)
- Data aggregation and analytics
- Separation of concerns (UI / API / DB)


## Features

### Task Board
- Create and delete boards
- Add, complete, and delete tasks with categories
- Display tasks dynamically
- Inline task creation (Trello-style)
- Mark tasks as completed and "celebration:)"
- Persistent storage using SQLite
- Input validation and error handling
- Foreign-key relationships between boards and tasks

### Analytics Dashboard
- Total tasks, active tasks, completion rate
- Critical task counter (alert-style UI)
- Tasks per category (bar chart)
- Active vs completed tasks (pie chart)
- Task creation activity over time (hero timeline chart)
- Aggregated insights (overloaded board, dominant category, board with the most active tasks)

### Architecture & Practices
- MVC-like structure in frontend
- REST API with aggregated endpoints 
    (e.g. `GET /stats` - Return chart data; `DELETE /boards/<id>` - Remove board with all its tasks)
- Safe SQL queries and joins
- Modular frontend rendering
- Event delegation and chart lifecycle management
- Defensive programming (validation, try/catch), error handling
- Consistent JSON responses


## Screenshots

![Task Boards](docs/boards.png)
![Analytics Dashboard](docs/analytics.png)

🎥 Demo Video: https://youtu.be/link


## What I learned

- Connecting frontend and backend systems, modular UI
- Structuring a small full-stack project
- SQL aggregation and analytics queries
- Designing and implementing REST APIs
- Handling asynchronous frontend/backend requests, debugging issues
- Data visualization principles
- Writing maintainable, readable code
- Using Git and feature branches for development


## Project Structure

"tree /f"

C:.
│   .gitignore
│   README.md
│
├───.vscode
│       launch.json
│
├───app
│   │   app.py
│   │   requirements.txt
│   │
│   ├───data
│   │       tasks.db
│   │
│   ├───static
│   │   │   analytics.js
│   │   │   api.js
│   │   │   celebration.js
│   │   │   styleAnalytics.css
│   │   │   styleTasks.css
│   │   │   tasks.js
│   │   │   ui.js
│   │   │
│   │   ├───pictures
│   │   │       chicagofire.gif
│   │   │       crocodile.jpg
│   │   │       dance.gif
│   │   │       dicaprio.png
│   │   │       wallpaper.png
│   │   │       wallpaper1.jpg
│   │   │
│   │   └───sounds
│   │           dance.mp3
│   │           gatsby.mp3
│   │           hawaii.mp3
│   │
│   ├───templates
│           analytics.html
│           tasks.html
│   
│
├───docs
│       demo.gif
│
└───venv


## How to Run Locally

### 1. Clone the repository

https://github.com/ke-David/smart-task-dashboard.git
cd smart-task-dashboard

### 2. Create and activate virtual environment

python -m venv venv
venv\Scripts\activate

### 3. Install dependencies

pip install -r backend/requirements.txt

### 4. Run the backend server

python app/app.py

Backend runs at:
http://127.0.0.1:5000

### 5. Open frontend

Open http://127.0.0.1:5000/home in your browser.


## Future Improvements

- Task filtering and sorting
- Task completion timestamps
- Creating deadlines, date range selector
- Focus mode for a specific task
- Dark mode
- Drag-and-drop task reordering
- User accounts & authentication
- Ppriority prediction and advanced analytics using basic ML
- Exporting charts

## Notes

This project is intentionally kept framework-light to highlight core concepts, not library overdose.

 
