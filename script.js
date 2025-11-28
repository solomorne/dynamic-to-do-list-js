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


// -------------------------
// Local Storage enhancement
// (appended code — does not delete or modify the block above)
// -------------------------

/*
  Strategy:
  - Replace/cloning of the original add button and input to remove the previously-attached listeners
    which referenced the original addTask function.
  - Implement tasks array, saveTasks, loadTasks and addTaskWithStorage.
  - Use addTaskWithStorage(..., false) when loading so items are not duplicated in storage.
*/

document.addEventListener('DOMContentLoaded', function () {
    // Re-query DOM elements (some may be replaced below)
    const originalAddButton = document.getElementById('add-task-btn');
    const originalTaskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Clone & replace the button to remove earlier event listeners bound to the original addTask
    const addButton = originalAddButton.cloneNode(true);
    originalAddButton.parentNode.replaceChild(addButton, originalAddButton);

    // Clone & replace the input to remove earlier event listeners bound to the original addTask
    const taskInput = originalTaskInput.cloneNode(true);
    originalTaskInput.parentNode.replaceChild(taskInput, originalTaskInput);

    // tasks array to hold { id, text }
    let tasks = [];

    // Save tasks array to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a task element and (optionally) save it.
    // signature: addTaskWithStorage(taskText, save = true, id = null)
    function addTaskWithStorage(taskText, save = true, id = null) {
        const trimmedText = (typeof taskText === 'string') ? taskText.trim() : '';
        if (trimmedText === "") {
            if (save) {
                alert("Please enter a task.");
            }
            return;
        }

        const taskId = id || (Date.now().toString() + Math.floor(Math.random() * 10000).toString());

        // Create DOM elements
        const li = document.createElement('li');
        li.textContent = trimmedText;
        li.dataset.id = taskId;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.classList.add('remove-btn');

        // Remove handler that updates DOM and localStorage
        removeBtn.onclick = function () {
            if (li.parentNode === taskList) {
                taskList.removeChild(li);
            }

            // Update tasks array and save
            const index = tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
            }
        };

        // Append and optionally save
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        if (save) {
            tasks.push({ id: taskId, text: trimmedText });
            saveTasks();
            taskInput.value = "";
        }
    }

    // Load tasks from localStorage and render
    function loadTasks() {
        const stored = localStorage.getItem('tasks');
        const storedTasks = JSON.parse(stored || '[]');
        tasks = Array.isArray(storedTasks) ? storedTasks : [];

        // Render each stored task without re-saving
        tasks.forEach(taskObj => {
            if (taskObj && typeof taskObj.text === 'string') {
                addTaskWithStorage(taskObj.text, false, taskObj.id);
            }
        });
    }

    // Wire the cloned controls to the storage-aware add function
    addButton.addEventListener('click', function () {
        addTaskWithStorage(taskInput.value, true);
    });

    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTaskWithStorage(taskInput.value, true);
        }
    });

    // Load saved tasks
    loadTasks();
});
