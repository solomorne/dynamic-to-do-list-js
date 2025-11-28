// Run JavaScript only after the page fully loads
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Array that holds task objects { id: string, text: string }
    let tasks = [];

    /**
     * Save the current tasks array to Local Storage
     */
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Create a single task DOM element and append it to the task list.
     * If save === true, the task is added to the tasks array and persisted.
     *
     * @param {string} taskText - The text of the task
     * @param {boolean} [save=true] - Whether to save this task to Local Storage
     * @param {string|null} [id=null] - Optional id for the task (used when loading)
     */
    function addTask(taskText, save = true, id = null) {
        // Trim and validate input
        const trimmedText = (typeof taskText === 'string') ? taskText.trim() : '';
        if (trimmedText === "") {
            if (save) { // only alert when user attempted to add (not when loadTasks calls addTask)
                alert("Please enter a task.");
            }
            return;
        }

        // Generate unique id if not provided
        const taskId = id || (Date.now().toString() + Math.floor(Math.random() * 10000).toString());

        // Create list item and set its text
        const li = document.createElement('li');
        li.textContent = trimmedText;
        li.dataset.id = taskId; // store id on element for later reference

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        // Use classList.add as required
        removeBtn.classList.add('remove-btn');

        // When clicked, remove the li from DOM and update Local Storage
        removeBtn.onclick = function () {
            // Remove from DOM
            if (li.parentNode === taskList) {
                taskList.removeChild(li);
            }

            // Remove from tasks array by id
            const index = tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
            }
        };

        // Append the button to the list item and the item to the list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // If requested, add to tasks array and persist
        if (save) {
            tasks.push({ id: taskId, text: trimmedText });
            saveTasks();
        }

        // Clear the input field if this was a user-added task
        if (save) {
            taskInput.value = "";
        }
    }

    /**
     * Load tasks from Local Storage and render them into the DOM.
     * Uses addTask(taskText, false, id) to avoid saving again while loading.
     */
    function loadTasks() {
        const stored = localStorage.getItem('tasks');
        const storedTasks = JSON.parse(stored || '[]');

        // Ensure tasks is the stored array (so we keep ids and can modify)
        tasks = Array.isArray(storedTasks) ? storedTasks : [];

        // Create DOM elements for each stored task
        tasks.forEach(taskObj => {
            // Expect taskObj to be { id: string, text: string }
            if (taskObj && typeof taskObj.text === 'string') {
                addTask(taskObj.text, false, taskObj.id);
            }
        });
    }

    // Add click event listener for "Add Task" button
    addButton.addEventListener('click', function () {
        addTask(taskInput.value, true);
    });

    // Allow pressing Enter (keypress as requested) to add a task
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask(taskInput.value, true);
        }
    });

    // Load tasks from Local Storage on page load
    loadTasks();
});
