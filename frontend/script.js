const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const taskList = document.getElementById("task-list");

let tasks = [];

//load tasks
document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks(){
    const res = await fetch("http://127.0.0.1:5000/tasks");
    tasks = await res.json();
    renderTasks();
}

function renderTasks(){
    taskList.innerHTML = "";

    tasks.forEach(task => renderTask(task));
}

function renderTask(task){
    const li = document.createElement("li");
    li.textContent = `${task.text} (${task.category})`;

    taskList.appendChild(li);
}

form.addEventListener ("submit", async (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();
    const category = categorySelect.value;
    
    if (text === "") return;

    const task = {text, category};

    await fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });

    taskInput.value = "";
    loadTasks();
})

// form.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const taskText = taskInput.value.trim();
//     const category = categorySelect.value;

//     if (taskText === "") return;

//     const task = {
//         text: taskText,
//         category: category
//     };

//     tasks.push(task);
//     renderTasks();

//     taskInput.value = "";
// });

// function renderTasks() {
//     taskList.innerHTML = "";

//     function renderTask(task) {
//         const li = document.createElement("li");
//         li.textContent = `${task.text} (${task.category})`; //template literal, can put any JS expression, not just variables
//         taskList.appendChild(li);
//     }

//     tasks.forEach(function (task){  //anonymous func
//         const li = document.createElement("li");
//         li.textContent = `${task.text} (${task.category})`;
//         taskList.appendChild(li); //only accepts element made by document.createElement, li is a Node object
//     });

// }


 
