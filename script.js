// Run JavaScript only after the page fully loads
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Function to add a new task
    function addTask() {
        // Get trimmed input value
        let taskText = taskInput.value.trim();

        // Prevent empty task submission
        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        // Create new list item
        const li = document.createElement('li');
        li.textContent = taskText;

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";

        // Add class using classList.add (required)
        removeBtn.classList.add('remove-btn');

        // Remove task on click
        removeBtn.onclick = function () {
            taskList.removeChild(li);
        };

        // Append remove button and task to the list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // Clear input
        taskInput.value = "";
    }

    // Add task when clicking the button
    addButton.addEventListener('click', addTask);

    // Add task using Enter key
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Invoke addTask on page load (as instructed)
    addTask();
});
