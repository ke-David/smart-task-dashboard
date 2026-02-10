const taskList = document.getElementById("task-list");

export function renderTasks(tasks){
    taskList.innerHTML = "";
    // tasks.forEach(task => renderTask(task));
    tasks.forEach(renderTask);
}

export function renderTask(task){
    const li = document.createElement("li");
    // li.id = `task-${task.id}`;  // 'task-' prefix to avoid numeric only Id (that might be tricky with CSS selectors)
    li.dataset.id = task.id;
    li.innerHTML = `${task.id}.     ${task.text} (${task.category}) 
                        <button class="delete-btn">X</button>`; //template literal, can put any JS expression, not just variables

    taskList.appendChild(li);
}