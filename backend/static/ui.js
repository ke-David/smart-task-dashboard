const taskList = document.getElementById("task-list");
const boardContainer = document.getElementById("board-container");
let categoryChartInstance;
let statusChartInstance;
let timelineChart;

export function renderTasks(tasks){
    taskList.innerHTML = "";
    tasks.forEach(renderTask);
}

export function renderTask(task){
    const li = document.createElement("li");

    if (task.completed === 1) {
      li.classList.add("completed");
    }
    li.dataset.id = task.id;
    li.classList.add("task-item");
    li.innerHTML = ` <span class="task-id">${task.id}.       </span>
                    <span class="task-text">${task.text}</span>
                    <span class="task-category">(${task.category})</span>
                    <button class="delete-btn">X</button> 
                    <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>`; //template literal, can put any JS expression, not just variables

    taskList.appendChild(li);
}

export function renderCharts(data){
    try {
        // Tasks per category chart
        if (categoryChartInstance) categoryChartInstance.destroy();

        categoryChartInstance = new Chart(document.getElementById("categoryChart"), {
            type: "bar",
            data: {
            labels: Object.keys(data.tasks_by_category),
            datasets: [{
                label: "# of Tasks",
                data: Object.values(data.tasks_by_category),
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Completed vs active chart
        if (statusChartInstance) statusChartInstance.destroy();

        statusChartInstance = new Chart(document.getElementById("statusChart"), {
            type: "pie",
            data: {
            labels: ["Active", "Completed"],
            datasets: [{
                data: [data.completed_vs_active.active, data.completed_vs_active.completed],
                backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)"]
            }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // hero timeline
        if (timelineChart) timelineChart.destroy();

        const labels = data.timeline.map(d => d.day);
        const timelineData = data.timeline.map(d => d.count);

        timelineChart = new Chart(document.getElementById("timelineChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Tasks Created",
                    data: timelineData,  
                    tension: 0.35,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
        alert("Failed to load analytics");
    }
    
}

export function renderSummary(data) {
    document.getElementById("totalTasks").textContent = data.total;

    document.getElementById("completionRate").textContent = data.completionRate + "%";

    document.getElementById("criticalTasks").textContent = data.critical;

    document.getElementById("activeTasks").textContent = data.active;
}

export function renderInsights(data){
    document.getElementById("dominantCategory").textContent =
            data.dominantCategory ? `${data.dominantCategory} (${data.percentage}%)` : "—";

    document.getElementById("heavyBoard").textContent =
            data.heavyBoard ? `${data.heavyBoard} (${data.active_count})` : "—";

    document.getElementById("avgTasksPerBoard").textContent =
            data.avg ? `${data.avg}` : "—";
}

export function renderBoards(boards) {
    boardContainer.innerHTML = "";
    boards.forEach(renderBoard)

    renderAddBoardButton(); 
}

function renderBoard (board){
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    boardDiv.dataset.id = board.id;

    boardDiv.innerHTML = `
        <div class="board-header">
            <div class="board-title">${board.title}</div>
            <button class="delete-board-btn">✕</button>
        </div>
        <div class="task-container"></div>
        <button class="add-task-btn">+ Add Task</button>
    `;

    const taskContainer = boardDiv.querySelector(".task-container");

    board.tasks.forEach(task => {
        taskContainer.appendChild(renderBoardTask(task));
    });

    boardContainer.appendChild(boardDiv);
}

function renderBoardTask(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = task.id;  //`task-${task.id}`;  'task-' prefix to avoid numeric only Id (that might be tricky with CSS selectors)

    if (task.completed === 1) {
        card.classList.add("completed");
    }

    card.innerHTML = `
        <div class="task-info">
            <span class="task-text" title="${task.text}">
                <strong>${task.text}</strong>
            </span>
            <span class="task-category">
                <small>(${task.category})</small>
            </span>
        </div>
        <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>
        <button class="delete-btn">✕</button>
    `;

    return card;
}

function renderAddBoardButton(){
    const btn = document.createElement("button");
    btn.id = "add-board-btn";
    btn.textContent = "+ Add Board";

    boardContainer.appendChild(btn);
}

