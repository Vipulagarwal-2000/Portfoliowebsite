document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let draggingElement = null;

    addTaskBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = createTaskItem(taskText);
            taskList.appendChild(taskItem);
            taskInput.value = '';
        }
    });

    function createTaskItem(taskText) {
        const taskItem = document.createElement('li');
        taskItem.draggable = true;
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="strike-btn">Strike</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        return taskItem;
    }

    taskList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            event.target.parentNode.parentNode.remove();
        } else if (event.target.classList.contains('strike-btn')) {
            const taskText = event.target.parentNode.parentNode.querySelector('span');
            taskText.classList.toggle('strikethrough');
        }
    });

    taskList.addEventListener('dragstart', function(event) {
        draggingElement = event.target;
        event.dataTransfer.effectAllowed = 'move';
    });

    taskList.addEventListener('dragover', function(event) {
        event.preventDefault();
        const boundingRect = event.target.getBoundingClientRect();
        const offsetY = event.clientY - boundingRect.top;
        const middleY = boundingRect.height / 2;

        if (offsetY > middleY) {
            event.target.style.marginBottom = '40px';
        } else {
            event.target.style.marginTop = '40px';
        }
    });

    taskList.addEventListener('dragleave', function(event) {
        event.target.style.marginTop = '0';
        event.target.style.marginBottom = '0';
    });

    taskList.addEventListener('drop', function(event) {
        event.preventDefault();
        if (draggingElement !== null) {
            const targetElement = event.target.closest('li');
            if (targetElement !== null) {
                if (draggingElement !== targetElement) {
                    const isAfter = draggingElement.offsetTop < targetElement.offsetTop;
                    if (isAfter) {
                        taskList.insertBefore(draggingElement, targetElement.nextSibling);
                    } else {
                        taskList.insertBefore(draggingElement, targetElement);
                    }
                }
                event.target.style.marginTop = '0';
                event.target.style.marginBottom = '0';
                draggingElement = null;
            }
        }
    });
});
