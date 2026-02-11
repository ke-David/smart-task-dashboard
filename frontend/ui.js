const taskList = document.getElementById("task-list");

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