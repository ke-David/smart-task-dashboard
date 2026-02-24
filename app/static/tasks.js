import * as api from "./api.js";
import * as ui from "./ui.js";
import * as celebration from "./celebration.js";

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const taskList = document.getElementById("task-list");
const submitBtn = document.getElementById("submit-btn");
const boardContainer = document.getElementById("board-container");
const wrapper = document.getElementById("boards-wrapper");

const toggle = document.getElementById("celebration-toggle");
toggle.checked = localStorage.getItem("celebrationsEnabled") !== "false";   //without it, when i reload the page, the toggle will not show the real value (UI and logic become out of sync)

let tasks = [];
let boards = [];


document.addEventListener("DOMContentLoaded", async () => {
    await refreshBoards();
});


async function refreshTasks() {
    try {
        tasks = await api.loadTasks();
        ui.renderTasks(tasks);
    } catch (err) {
        alert(err.message);
    }
}

document.addEventListener("wheel", (e) => {
    const taskContainer = e.target.closest(".task-container");
    if (!taskContainer) return; // if the mouse is not above the container, it stops

    const canScroll =
        taskContainer.scrollHeight > taskContainer.clientHeight;    // is the content actually 'higher' (vertically longer), than the window thaat i can see

    if (canScroll) {
        e.stopPropagation();    // doesn't affect the parents, only the inner container
    }
}, { passive: true });

boardContainer.addEventListener("change", async(event) => {
    if (!event.target.classList.contains("complete-checkbox")) return;

    const card = event.target.closest(".task-card");
    const taskId = parseInt(card.dataset.id, 10);
    const completed = event.target.checked; //boolean

    try {
        await api.markCompleted(taskId, completed);
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
        boards = await api.loadBoardTasks();
        ui.renderBoards(boards);
    } catch (err) {
        alert(err.message);
    }
}

// event delagation; The listener is attached to the board-container and it catches clicks from elements inside it, even if i add those later dynamically
// listener for multiple element added later
boardContainer.addEventListener("click", async (event) => {
    // add board btn 
    if (event.target.id === "add-board-btn") {
        openAddBoardInlineForm(event.target);
        return;
    }


    // add task btn
    if (event.target.classList.contains("add-task-btn")) {
        const addBtn = event.target;
        const board = event.target.closest(".board");
        const boardId = parseInt(board.dataset.id, 10);
        openAddTaskInlineForm(board, boardId, addBtn);
    }


    // delete board btn
    if (event.target.classList.contains("delete-board-btn")) {
        const board = event.target.closest(".board");
        const boardId = Number(board.dataset.id);

        const confirmed = await softConfirm({
            title: "Delete board?",
            message: "This will remove the board and ALL its tasks. This action cannot be undone.",
            danger: true
        });

        if (!confirmed) return;

        try {
            board.classList.add("removing");
            setTimeout(async () => {
                await api.deleteBoardWithTasks(boardId);
                await refreshBoards();
            }, 200);
        } catch (err) {
            alert(err.message);
        }

        return;
    }


    //delete task btn
    if(event.target.classList.contains("delete-btn")){
        const confirmed = await softConfirm({
            title: "Delete task?",
            message: "This will remove the task. This action cannot be undone.",
            danger: true
        });

        if (!confirmed) return;

        const card = event.target.closest(".task-card");
        const taskId = parseInt(card.dataset.id, 10);    

        try {
            await api.deleteTask(taskId);
            await refreshBoards();
        } catch (err) {
            alert(err.message);
        }
    }
});

function openAddBoardInlineForm(eventTarget){
    const addBoardBtn = document.getElementById("add-board-btn");

    // Prevent multiple inputs
    if (addBoardBtn.querySelector("input")) return;

    const addBtn = eventTarget;
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

    // submit handler (only if button is clicked)
    submitBtn.addEventListener("click", async () => {
        const title = input.value.trim();

        if (title === "") return;

        try {
            await api.addBoard(title);  
            form.replaceWith(addBtn);        
            await refreshBoards();
        } catch (err) {
            alert(err.message);
        }
    });

    // cancel handler
    cancelBtn.addEventListener("click", () => {
        form.replaceWith(addBtn);
    });
}

function openAddTaskInlineForm(board, boardId, addBtn){
    // if there's an existing one already, return
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

    // Submit handler (only button click)
    submitBtn.addEventListener("click", async () => {
        const text = input.value.trim();
        const category = select.value;

        if (text === "") return;

        const task = {text, category, boardId};

        try {
            await api.addTask(task);
            form.replaceWith(addBtn);   //will put tthe button back
            await refreshBoards();
        } catch (err) {
            alert(err.message);
        }
    });

    // Cancel handler
    cancelBtn.addEventListener("click", () => {
        form.replaceWith(addBtn);
    });
}

function softConfirm({ title, message, danger = false }) {
    // promise bc it will give a response later, when something happens (user clicks)
    // resolve() will finish the promise
    return new Promise(resolve => {     
        const overlay = document.getElementById("soft-confirm-overlay");
        const titleEl = document.getElementById("soft-confirm-title");
        const messageEl = document.getElementById("soft-confirm-message");
        const okBtn = document.getElementById("soft-confirm-ok");
        const cancelBtn = document.getElementById("soft-confirm-cancel");

        titleEl.textContent = title;
        messageEl.textContent = message;

        okBtn.classList.toggle("danger", danger);

        overlay.classList.remove("hidden");

        const cleanup = (result) => {
            overlay.classList.add("hidden");
            okBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(result);
        };

        okBtn.onclick = () => cleanup(true);
        cancelBtn.onclick = () => cleanup(false);
    });
}
 
