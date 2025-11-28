// Run JavaScript only after the page fully loads
document.addEventListener('DOMContentLoaded', function () {
    
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn'); 
    const taskInput = document.getElementById('task-input'); 
    const taskList = document.getElementById('task-list');

    // Function to add a new task
    function addTask() {
        // Get the input value and trim extra spaces
        let taskText = taskInput.value.trim();

        // Check if the task is empty
        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        // Create a new list item
        const li = document.createElement('li');
        li.textContent = taskText;

        // Create the remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.className = 'remove-btn';

        // Set onclick event to remove the task
        removeBtn.onclick = function () {
            taskList.removeChild(li);
        };

        // Append remove button to li, and li to task list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // Clear input field
        taskInput.value = "";
    }

    // Add click event listener for "Add Task" button
    addButton.addEventListener('click', addTask);

    // Allow pressing Enter to add a task
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Invoke addTask on DOMContentLoaded (as instructed)
    addTask();
});
