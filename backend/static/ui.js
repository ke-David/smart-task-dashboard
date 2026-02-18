const taskList = document.getElementById("task-list");
const boardContainer = document.getElementById("board-container");
let categoryChartInstance;
let statusChartInstance;

export function renderTasks(tasks){
    taskList.innerHTML = "";
    // tasks.forEach(task => renderTask(task));
    tasks.forEach(renderTask);
}

export function renderTask(task){
    const li = document.createElement("li");

    if (task.completed === 1) {
      li.classList.add("completed");
    //   console.log("hehh")
    }
    // li.id = `task-${task.id}`;  // 'task-' prefix to avoid numeric only Id (that might be tricky with CSS selectors)
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
            }
        });
    } catch (err) {
        console.error(err);
        alert("Failed to load analytics");
    }
    
}

export function renderBoards(boards) {
    boardContainer.innerHTML = "";
    boards.forEach(renderBoard)
}

function renderBoard (board){
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    boardDiv.dataset.id = board.id;

    boardDiv.innerHTML = `
        <div class="board-title">${board.title}</div>
        <div class="card-container"></div>
        <button id="add-card-btn">
            + Add Card
        </button>
    `;

    boardContainer.appendChild(boardDiv);
}




// export function renderBoards(tasks) {
//     const container = document.getElementById("board-container");
//     container.innerHTML = "";

//     // group tasks by category
//     const grouped = {};

//     tasks.forEach(task => {
//         if (!grouped[task.category]) {
//             grouped[task.category] = [];
//         }
//         grouped[task.category].push(task);
//     });

//     // create column per category
//     Object.entries(grouped).forEach(([category, categoryTasks]) => {

//         const column = document.createElement("div");
//         column.classList.add("column");

//         const title = document.createElement("div");
//         title.classList.add("column-title");
//         title.textContent = category;

//         column.appendChild(title);

//         categoryTasks.forEach(task => {
//             column.appendChild(createTaskCard(task));
//         });

//         container.appendChild(column);
//     });
// }

// function createTaskCard(task) {
//     const card = document.createElement("div");
//     card.classList.add("task-card");
//     card.dataset.id = task.id;

//     if (task.completed) {
//         card.classList.add("completed");
//     }

//     card.innerHTML = `
//         <div class="task-info">
//             <span>${task.text}</span>
//         </div>
//         <button class="delete-btn">X</button>
//         <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>
//     `;

//     return card;
// }