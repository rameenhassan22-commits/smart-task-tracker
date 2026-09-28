const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".task-list");
const totalTasksElements = document.querySelector("#total-tasks");
const completedTasksElements = document.querySelector("#completed-tasks");
const pendingTasksElements = document.querySelector("#pending-tasks");

let tasks = [
    {
        id: 1,
        title: "Complete Internship Task",
        completed: false
    },
    {
        id: 2,
        title: "Study JavaScript ES6+",
        completed: true
    },
    {
        id: 3,
        title: "Practice REST API",
        completed: false
    } 
];

function renderTasks(){
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const taskElement = document.createElement("article");

        taskElement.className = "task-card";

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

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskElement.appendChild(taskContent);
        taskElement.appendChild(taskActions);

        taskList.appendChild(taskElement);

    } );
}

renderTasks();