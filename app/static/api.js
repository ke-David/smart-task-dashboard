
const API_BASE = "http://127.0.0.1:5000";


export async function deleteTask(taskId) {
    const res = await fetch(`/tasks/${taskId}`, {
    method: "DELETE"
    });

    if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Delete failed");
    }
}

export async function loadTasks(){
    const res = await fetch(`/tasks`);
    
    if (!res.ok) {
        throw new Error("Failed to load tasks");
    }

    return await res.json();
}

export async function addTask(task) {
    const res = await fetch(`/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
    });

    if (!res.ok) {
    throw new Error("Add task failed");
    }
}

export async function markCompleted(taskId, completed){
    const res = await fetch(`/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
    });

    if (!res.ok) {
    throw new Error("Update task failed");
    }
}

export async function loadAnalytics() {
    const res = await fetch(`/stats`);
    
    if (!res.ok) {
        throw new Error("Failed to load analytics");
    }

    return await res.json();
}

export async function loadSum() {
    const res = await fetch(`/sum`);
    
    if (!res.ok) {
        throw new Error("Failed to load summary");
    }

    return await res.json();
}

export async function loadInsights() {
    const res = await fetch(`/insights`);
    
    if (!res.ok) {
        throw new Error("Failed to load insights");
    }

    return await res.json();   
}

export async function loadBoards() {
    const res = await fetch(`/boards`);

    if (!res.ok) throw new Error("Failed to load boards");

    return await res.json();
}

export async function addBoard(title) {
    const res = await fetch(`/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    if (!res.ok) throw new Error("Create board failed");
}

export async function loadBoardTasks() {
    const res = await fetch(`/boardTasks`);

    if (!res.ok) throw new Error("Failed to load boardTasks");

    return await res.json();
}

export async function deleteBoardWithTasks(boardId) {
    const res = await fetch(`/boards/${boardId}`, {
        method: "DELETE"
    });

    if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete board");
    }
}
