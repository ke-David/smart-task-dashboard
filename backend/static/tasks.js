import * as api from "./api.js";
import * as ui from "./ui.js";
import * as celebration from "./celebration.js";

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const taskList = document.getElementById("task-list");
const submitBtn = document.getElementById("submit-btn");
const addBoardCard = document.getElementById("add-board-card");

const toggle = document.getElementById("celebration-toggle");
toggle.checked = localStorage.getItem("celebrationsEnabled") !== "false";   //without it, when i reload the page, the toggle will not show the real value (UI and logic become out of sync)

let tasks = [];
let boards = [];

//load tasks n boards
document.addEventListener("DOMContentLoaded", async () => {
    await refreshBoards();
    await refreshTasks();
});

taskInput.addEventListener("input", () => {
  const isEmpty = taskInput.value.trim() === "";
  submitBtn.disabled = isEmpty;
})

async function refreshTasks() {
    try {
        tasks = await api.loadTasks();
        ui.renderTasks(tasks);
    } catch (err) {
        alert(err.message);
    }
}

form.addEventListener ("submit", async (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();
    const category = categorySelect.value;
    
    if (text === "") return;

    const task = {text, category};

    try {
        await api.addTask(task);
        taskInput.value = "";
        await refreshTasks();
    } catch (err) {
        alert(err.message);
    }
})

taskList.addEventListener("click", async(event) => {
    if(!event.target.classList.contains("delete-btn"))
        return;

    if (!confirm("Are you sure you want to delete this task?")) return;

    const li = event.target.closest("li");
    const taskId = parseInt(li.dataset.id, 10);    

    try {
        console.log(taskId);
    // await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
    //     method: "DELETE",
    // });
        await api.deleteTask(taskId);
        // api.loadTasks();
        await refreshTasks();
    } catch (err) {
        alert(err.message);
    }
})

taskList.addEventListener("change", async(event) => {
    if (!event.target.classList.contains("complete-checkbox")) return;

    const li = event.target.closest("li");
    const taskId = parseInt(li.dataset.id, 10);
    const completed = event.target.checked; //boolean

    try {
        await api.markCompleted(taskId, completed);
        // li.classList.toggle("completed", completed);
        await refreshTasks();

        if (completed === true) {
            await new Promise(r => requestAnimationFrame(r));
            celebration.ultimateCelebration();
        }
    } catch (err) {
        alert(err.message);
    }
});

toggle.addEventListener("change", () => {
    localStorage.setItem("celebrationsEnabled", toggle.checked);
});

async function refreshBoards() {
    try {
        boards = await api.loadBoards();
        ui.renderBoards(boards);
    } catch (err) {
        alert(err.message);
    }
}

addBoardCard.addEventListener("click", () => {
    // Prevent multiple inputs
    if (addBoardCard.querySelector("input")) return;

    const input = document.createElement("input");
    input.placeholder = "New board...";
    addBoardCard.appendChild(input);
    input.focus();

    input.addEventListener("keydown", async (e) => {
        if (e.key !== "Enter") return;

        const title = input.value.trim();
        if (!title) return;

        await api.addBoard(title);  
        input.remove();

        refreshBoards(); 
    });
});



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


 
