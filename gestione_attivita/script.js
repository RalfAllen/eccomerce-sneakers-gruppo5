document.addEventListener('DOMContentLoaded', (event) => {
    loadSettings();
    loadTasks();
});

function changeBackground() {
    var backgroundInput = document.getElementById("backgroundInput").value;
    if (backgroundInput && isValidUrl(backgroundInput)) {
        document.body.style.backgroundImage = "url('" + backgroundInput + "')";
        localStorage.setItem('backgroundImage', backgroundInput);
    } else if (backgroundInput === "") {
        // Rimuovi l'immagine di sfondo
        document.body.style.backgroundImage = "";
        localStorage.removeItem('backgroundImage');
    } else {
        alert("Inserisci un URL valido per l'immagine di sfondo.");
    }
}

function removeBackground() {
    document.body.style.backgroundImage = "";
    localStorage.removeItem('backgroundImage');
}

function removeTheme() {
    document.body.className = "";
    localStorage.removeItem('theme');

    // Aggiungi una notifica
    var notification = document.createElement("div");
    notification.textContent = "Tema rimosso";
    notification.className = "theme-notification";

    document.body.appendChild(notification);

    // Rimuovi la notifica dopo 3 secondi
    setTimeout(function() {
        notification.style.opacity = 0;
        setTimeout(function() {
            notification.parentNode.removeChild(notification);
        }, 1000);
    }, 3000);
}

function changeTheme() {
    var themeSelect = document.getElementById("themeSelect");
    var body = document.body;
    var selectedTheme = themeSelect.value;

    switch (selectedTheme) {
        case "light":
            body.className = "light";
            break;
        case "blue":
            body.className = "blue";
            break;
        case "orange":
            body.className = "orange";
            break;
        case "red":
            body.className = "red";
            break;
        case "yellow":
            body.className = "yellow";
            break;
        default:
            body.className = "";
            break;
    }

    localStorage.setItem('theme', selectedTheme);

    // Aggiungi una notifica
    var notification = document.createElement("div");
    notification.textContent = "Tema cambiato: " + selectedTheme;
    notification.className = "theme-notification";

    document.body.appendChild(notification);

    // Rimuovi la notifica dopo 3 secondi
    setTimeout(function() {
        notification.style.opacity = 0;
        setTimeout(function() {
            notification.parentNode.removeChild(notification);
        }, 1000);
    }, 3000);
}

function addTask() {
    var taskInput = document.getElementById("taskInput").value.trim();
    var dueDateInput = document.getElementById("dueDateInput").value.trim();
    var categoryInput = document.getElementById("categoryInput").value.trim();
    var priorityInput = document.getElementById("priorityInput").value.trim();
    var taskList = document.getElementById("taskList");

    if (taskInput !== "") {
        var li = document.createElement("li");
        var taskDetails = "<strong>" + taskInput + "</strong>";

        if (dueDateInput !== "") {
            var currentDate = new Date();
            var dueDate = new Date(dueDateInput);
            var timeDiff = dueDate - currentDate;
            var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

            taskDetails += " - Scadenza: " + dueDateInput;

            if (daysDiff <= 3) {
                taskDetails += ` <div class="notification">
                                    <span class="notification-icon">&#9888;</span>
                                    <span>Notifica: Manca poco alla scadenza (entro ${daysDiff} giorni)</span>
                                 </div>`;
            }
        }

        if (categoryInput !== "") {
            taskDetails += " - Categoria: <span class='category'>" + categoryInput + "</span>";
        }

        if (priorityInput !== "") {
            taskDetails += " - Priorità: <span class='priority' data-priority='" + priorityInput + "'>" + priorityInput + "</span>";
        }

        li.innerHTML = taskDetails;

        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Elimina";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = function() {
            li.parentNode.removeChild(li);
            saveTasks();
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        document.getElementById("taskInput").value = "";
        document.getElementById("dueDateInput").value = "";
        document.getElementById("categoryInput").value = "";
        document.getElementById("priorityInput").value = "";
        saveTasks();
    } else {
        alert("Inserisci un'attività valida.");
    }
}

function saveTasks() {
    var taskList = document.getElementById("taskList");
    var tasks = [];
    taskList.querySelectorAll('li').forEach((li) => {
        tasks.push(li.innerHTML);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var taskList = document.getElementById("taskList");
    tasks.forEach((taskHTML) => {
        var li = document.createElement("li");
        li.innerHTML = taskHTML;
        var deleteBtn = li.querySelector('button.delete-btn');
        deleteBtn.onclick = function() {
            li.parentNode.removeChild(li);
            saveTasks();
        };
        taskList.appendChild(li);
    });
    sortTasks();
}

function sortTasks() {
    var taskList = document.getElementById("taskList");
    var tasks = Array.from(taskList.getElementsByTagName("li"));
    var sortOption = document.getElementById("sortSelect").value;

    tasks.sort((a, b) => {
        if (sortOption === "date") {
            var dateA = new Date(a.querySelector('div.notification span').textContent.split(' - Scadenza: ')[1] || Infinity);
            var dateB = new Date(b.querySelector('div.notification span').textContent.split(' - Scadenza: ')[1] || Infinity);
            return dateA - dateB;
        } else if (sortOption === "priority") {
            var priorityA = a.dataset.priority || '';
            var priorityB = b.dataset.priority || '';
            return priorityA.localeCompare(priorityB);
        } else if (sortOption === "category") {
            var categoryA = a.querySelector('span.category') ? a.querySelector('span.category').textContent : '';
            var categoryB = b.querySelector('span.category') ? b.querySelector('span.category').textContent : '';
            return categoryA.localeCompare(categoryB);
        } else {
            return 0;
        }
    });

    tasks.forEach((task) => {
        taskList.appendChild(task);
    });
}

function loadSettings() {
    var backgroundImage = localStorage.getItem('backgroundImage');
    var theme = localStorage.getItem('theme');
    if (backgroundImage) {
        document.body.style.backgroundImage = "url('" + backgroundImage + "')";
        document.getElementById("backgroundInput").value = backgroundImage;
    }
    if (theme) {
        document.body.className = theme;
        document.getElementById("themeSelect").value = theme;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}












