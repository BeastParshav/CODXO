document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const incompleteTasksList = document.getElementById("incompleteTasks");
    const completeTasksList = document.getElementById("completeTasks");

    addTaskBtn.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            taskInput.value = "";
        }
    });

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTaskBtn.click();
        }
    });

    function addTask(taskText) {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">❌</button>
        `;
        li.prepend(checkbox);

        incompleteTasksList.appendChild(li);

        
        li.querySelector(".delete-btn").addEventListener("click", function() {
            li.remove();
        });

        
        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                completeTasksList.appendChild(li);
                // Remove delete button from incomplete task
                li.querySelector(".delete-btn").remove();
                // Add delete functionality to completed task
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-btn");
                deleteBtn.innerHTML = "❌";
                deleteBtn.addEventListener("click", function() {
                    li.remove();
                });
                li.appendChild(deleteBtn);
            } else {
                incompleteTasksList.appendChild(li);
                // Add delete button back to incomplete task
                li.appendChild(li.querySelector(".delete-btn"));
            }
        });
    }
});
