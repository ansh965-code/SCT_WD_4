const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        date: taskDate.value,
        time: taskTime.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
}


function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
        
        <div class="task-left">

            <input type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${task.id})">

            <div class="task-info">

                <h3>${task.text}</h3>

                <p>
                    📅 ${task.date || "No Date"}
                    &nbsp;&nbsp;
                    ⏰ ${task.time || "No Time"}
                </p>

            </div>

        </div>

        <div class="task-actions">

            <button class="edit-btn"
            onclick="editTask(${task.id})">

            <i class="fa-solid fa-pen"></i>

            </button>

            <button class="delete-btn"
            onclick="deleteTask(${task.id})">

            <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

    taskCount.textContent = tasks.length;
}


function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();
    renderTasks();

}

// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();

}

// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt("Edit Task", task.text);

    if (updatedText === null || updatedText.trim() === "")
        return;

    task.text = updatedText.trim();

    saveTasks();
    renderTasks();

}


function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(button => button.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});


renderTasks();