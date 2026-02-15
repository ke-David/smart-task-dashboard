# Smart Task Dashboard

A small web app built to refresh and demonstrate core IT BSc skills through one coherent, end-to-end project.

The goal of this project: building a realistic application using common tools and concepts expected from a junior IT graduate.


## Project Goals

- Refresh frontend development fundamentals
- Practice backend development with Python and Flask
- Work with relational databases
- Apply REST API design principles
- Apply Git and GitHub workflows
- Build a simple web application to create and manage daily tasks.



## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js (analytics visualization)

### Backend
- Python
- Flask

### Database
- SQLite

### Development & Tools
- Git
- GitHub
- REST APIs
- Virtual environments (venv)
- Basic data aggregation and analytics


## Features

### Task Management
- Create tasks with categories
- Display tasks dynamically
- Delete tasks
- Mark tasks as completed
- Persistent storage using SQLite
- Input validation and error handling

### Backend API (REST)
- `GET /tasks` – Return all tasks
- `POST /tasks` – Create a new task
- `PUT /tasks/<id>` – Update task (mark as done)
- `DELETE /tasks/<id>` – Remove task
- `GET /stats` – Return aggregated analytics data

### Analytics Dashboard
- Task count per category
- Completed vs active tasks
- Data visualization using Chart.js

### Practices
- MVC structure in frontend
- Database initialization
- Consistent JSON error responses
- Event delegation in frontend
- Defensive programming (validation, try/catch)

## Screenshots

..


## Project Structure

smart-task-dashboard/
│
|--- frontend/
│  |--- index.html
│  |--- style.css
│  |--- script.js
|  |--- ui.js
|  |---api.js
│
|--- backend/
│  |--- app.py
|  |--- requirements.txt
│  |--- tasks/
|     |--- tasks.db
|     |--- tasks.json
│
|--- .gitignore
|--- README.md


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

python backend/app.py

Backend runs at:
http://127.0.0.1:5000

### 5. Open frontend

Open frontend/index.html in your browser.


## What I learned

- Designing and implementing REST APIs
- Connecting frontend and backend systems
- Working with SQLite databases
- Handling asynchronous JavaScript requests
- Debugging CORS and network issues (ex when i swiched to modules)
- Structuring a small full-stack project
- Writing clean, readable, and maintainable code
- Using Git for development

## Future Improvements

- Task filtering and sorting
- Completion timestamps (and analytics using timestamps)
- Deployment to cloud
- Unit test for backend routes
- Ppriority prediction using basic ML
- Nicer UI

 
