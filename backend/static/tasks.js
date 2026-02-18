import * as api from "./api.js";
import * as ui from "./ui.js";
import * as celebration from "./celebration.js";

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const taskList = document.getElementById("task-list");
const submitBtn = document.getElementById("submit-btn");
const addBoardBtn = document.getElementById("add-board-btn");
const boardContainer = document.getElementById("board-container");
const wrapper = document.getElementById("boards-wrapper");

const toggle = document.getElementById("celebration-toggle");
toggle.checked = localStorage.getItem("celebrationsEnabled") !== "false";   //without it, when i reload the page, the toggle will not show the real value (UI and logic become out of sync)

let tasks = [];
let boards = [];

//load tasks n boards
document.addEventListener("DOMContentLoaded", async () => {
    await refreshBoards();
    // await refreshTasks();
});

// taskInput.addEventListener("input", () => {
//   const isEmpty = taskInput.value.trim() === "";
//   submitBtn.disabled = isEmpty;
// })

async function refreshTasks() {
    try {
        tasks = await api.loadTasks();
        ui.renderTasks(tasks);
    } catch (err) {
        alert(err.message);
    }
}

// taskList.addEventListener("click", async(event) => {
boardContainer.addEventListener("click", async(event) => {
    if(!event.target.classList.contains("delete-btn"))
        return;

    if (!confirm("Are you sure you want to delete this task?")) return;

    // const li = event.target.closest("li");
    const card = event.target.closest(".task-card");
    const taskId = parseInt(card.dataset.id, 10);    

    try {
        console.log(taskId);
    // await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
    //     method: "DELETE",
    // });
        await api.deleteTask(taskId);
        // api.loadTasks();
        // await refreshTasks();
        await refreshBoards();
    } catch (err) {
        alert(err.message);
    }
})

// taskList.addEventListener("change", async(event) => {
boardContainer.addEventListener("change", async(event) => {
    if (!event.target.classList.contains("complete-checkbox")) return;

    // const li = event.target.closest("li");
    const card = event.target.closest(".task-card");
    const taskId = parseInt(card.dataset.id, 10);
    const completed = event.target.checked; //boolean

    try {
        await api.markCompleted(taskId, completed);
        // li.classList.toggle("completed", completed);
        // await refreshTasks();
        await refreshBoards();

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
        // boards = await api.loadBoards();
        boards = await api.loadBoardTasks();
        ui.renderBoards(boards);
    } catch (err) {
        alert(err.message);
    }
}

addBoardBtn.addEventListener("click", async(event) => {
    // Prevent multiple inputs
    if (addBoardBtn.querySelector("input")) return;

    const addBtn = event.target;
    if (addBoardBtn.querySelector(".inline-board-form")) return;

    const form = document.createElement("div");
    form.className = "inline-board-form";

    form.innerHTML = `
        <input type="text" class="board-input" placeholder="New board..." required>
        <button class="board-submit" disabled>Ok</button>
        <button class="board-cancel">✕</button>
    `;

    // Replace button with form
    addBtn.replaceWith(form);

    const input = form.querySelector(".board-input");
    const submitBtn = form.querySelector(".board-submit");
    const cancelBtn = form.querySelector(".board-cancel");

    input.focus();

    // Enable submit only if text exists
    input.addEventListener("input", () => {
        const isEmpty = input.value.trim() === "";
        submitBtn.disabled = isEmpty;    
    });

    // Submit handler (button click ONLY)
    submitBtn.addEventListener("click", async () => {
        const title = input.value.trim();

        if (title === "") return;

        try {
            await api.addBoard(title);  
            form.replaceWith(addBtn);        
            // await refreshTasks();
            await refreshBoards();
        } catch (err) {
            alert(err.message);
        }
    });

    // Cancel handler
    cancelBtn.addEventListener("click", () => {
        form.replaceWith(addBtn);
    });

});

// event delagation!!! The listener is attached to the board-container and it catches clicks from elements inside it, even if i add those later dynamically
boardContainer.addEventListener("click", async (event) => {
    if (!event.target.classList.contains("add-task-btn")) return;

    const addBtn = event.target;
    const board = event.target.closest(".board");
    const boardId = parseInt(board.dataset.id, 10);
    // console.log("bId: " + boardId);

    // if theres an existing one already, return
    if (board.querySelector(".inline-card-form")) return;

    const form = document.createElement("div");
    form.className = "inline-card-form";

    form.innerHTML = `
        <input type="text" class="card-input" placeholder="New task..." required>

        <select class="card-category">
            <option value="Critical">Critical</option>
            <option value="Important">Important</option>
            <option value="Moderate">Moderate</option>
            <option value="Less Important">Less Important</option>
            <option value="Unimportant">Unimportant</option>
        </select>

        <button class="card-submit" disabled>Ok</button>
        <button class="card-cancel">✕</button>
    `;

    // Replace button with form
    addBtn.replaceWith(form);

    const input = form.querySelector(".card-input");
    const select = form.querySelector(".card-category");
    const submitBtn = form.querySelector(".card-submit");
    const cancelBtn = form.querySelector(".card-cancel");

    input.focus();

    // Enable submit only if text exists
    input.addEventListener("input", () => {
        const isEmpty = input.value.trim() === "";
        submitBtn.disabled = isEmpty;    
    });

    // Submit handler (button click ONLY)
    submitBtn.addEventListener("click", async () => {
        const text = input.value.trim();
        const category = select.value;

        if (text === "") return;

        const task = {text, category, boardId};

        try {
            await api.addTask(task);
            form.replaceWith(addBtn);   //will put tthe button back
            // await refreshTasks();
            await refreshBoards();
        } catch (err) {
            alert(err.message);
        }
    });

    // Cancel handler
    cancelBtn.addEventListener("click", () => {
        form.replaceWith(addBtn);
    });
    
});

// mouse
wrapper.addEventListener("wheel", e => {

    if (e.deltaY === 0) return;

    e.preventDefault();

    wrapper.scrollLeft += e.deltaY;
});


// form.addEventListener ("submit", async (event) => {

//     event.preventDefault();

//     const text = taskInput.value.trim();
//     const category = categorySelect.value;
    
//     if (text === "") return;

//     const task = {text, category};

//     try {
//         await api.addTask(task);
//         taskInput.value = "";
//         await refreshTasks();
//     } catch (err) {
//         alert(err.message);
//     }
// })

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


 
