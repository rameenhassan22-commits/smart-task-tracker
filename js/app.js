const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".task-list");

const totalTasksElements = document.querySelector("#total-tasks");
const completedTasksElements = document.querySelector("#completed-tasks");
const pendingTasksElements = document.querySelector("#pending-tasks");

const filterButton = document.querySelectorAll(".task-filters button");

let tasks = [];

let currentFilter = "all";

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "active"){
        filteredTasks = tasks.filter((task) =>  {
            return !task.completed;
        });
    }else if (currentFilter === "completed"){
        filteredTasks = tasks.filter((task) => {
            return task.completed;
        });
    }

    if (filteredTasks.length ===0){
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No tasks Found.";
        taskList.appendChild(emptyMessage);
        updateStatistics();
        return;
    }

    filteredTasks.forEach((task) => {
      
        const taskElement = document.createElement("article");

        taskElement.className = "task-card";

        taskElement.dataset.id = task.id;

        if(task.completed){
            taskElement.classList.add("completed");
        }

        const taskContent  = document.createElement("div");
        taskContent.className = "task-content";

        const checkbox =document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.id = `task-${task.id}`;

        const label = document.createElement("label");
        label.textContent = task.title;
        label.htmlFor = `task-${task.id}`;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(label);

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.innerHTML = '<i class="fas fa-pen"></i> Edit';
        editButton.dataset.action = "edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteButton.dataset.action = "delete";

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskElement.appendChild(taskContent);
        taskElement.appendChild(taskActions);

        taskList.appendChild(taskElement);

    } );

updateStatistics();

}

function updateStatistics(){
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => {
        return task.completed;
    }).length;
    const pendingTasks = totalTasks - completedTasks;

    totalTasksElements.textContent = totalTasks;
    completedTasksElements.textContent = completedTasks;
    pendingTasksElements.textContent = pendingTasks;
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskTitle = taskInput.value.trim();

    if(taskTitle === ""){
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed:false
    };

    tasks.push(newTask);
    taskInput.value = "";
    
    renderTasks();
});

taskList.addEventListener("change", (event) => {

    if(event.target.type !== "checkbox"){
        return;
    }
    const taskCard = event.target.closest(".task-card");

    if(!taskCard){
        return;
    }

    const taskId = Number(taskCard.dataset.id);

    const task = tasks.find((task) => {
        return task.id === taskId;
    });

    if(!task){
        return;
    }

    task.completed = event.target.checked;
    renderTasks();
});

taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if(!button){
        return;
    }

    const taskCard = button.closest(".task-card");

    if(!taskCard){
        return;
    }
    const taskId = Number(taskCard.dataset.id);
    const task = tasks.find((task) => {
        return task.id === taskId;
    });
    if(!task){
        return;
    }

    if(button.dataset.action === "delete"){
        const confirmDelete = confirm(
            "Are you sure you want to delete this task?" 
        );
        if(!confirmDelete){
            return;
        }
        tasks = tasks.filter((task) =>{
            return task.id !== taskId;
        });
        renderTasks();
        return;
    }

    if(button.dataset.action === "edit"){
        const updatedTitle = prompt(
            "Edit your task:",
            task.title
        );

        if (updatedTitle === null) {
            return;
        }
        const newTitle = updatedTitle.trim();

        if(newTitle === ""){
            alert("Task title cannot be empty.");
            return;
        }
        task.title = newTitle;
        renderTasks();

    }
});

filterButton.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();