
const API_BASE = "http://127.0.0.1:5000";


export async function deleteTask(taskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE"
    });

    if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Delete failed");
    }
}

export async function loadTasks(){
    const res = await fetch(`${API_BASE}/tasks`);
    // tasks = await res.json();
    // renderTasks();
    if (!res.ok) {
        throw new Error("Failed to load tasks");
    }

    return await res.json();
}

export async function addTask(task) {
    const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
    });

    if (!res.ok) {
    throw new Error("Add task failed");
    }
}

export async function markCompleted(taskId, completed){
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
    });

    if (!res.ok) {
    throw new Error("Update task failed");
    }
}

export async function loadAnalytics() {
    const res = await fetch(`${API_BASE}/stats`);
    
    if (!res.ok) {
        throw new Error("Failed to load analytics");
    }

    return await res.json();
}

export async function loadBoards() {
    const res = await fetch(`${API_BASE}/boards`);

    if (!res.ok) throw new Error("Failed to load boards");

    return await res.json();
}

export async function addBoard(title) {
    const res = await fetch(`${API_BASE}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    if (!res.ok) throw new Error("Create board failed");
}

export async function loadBoardTasks() {
    const res = await fetch(`${API_BASE}/boardTasks`);

    if (!res.ok) throw new Error("Failed to load boardTasks");

    return await res.json();
}

