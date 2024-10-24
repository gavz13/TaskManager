let users = JSON.parse(localStorage.getItem('users')) || []; 
let currentUser = null; 


function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}


function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}


function showTaskManager() {
    document.getElementById('taskManager').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    loadTasks(); 
}


function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (username === '' || password === '') {
        alert('Please fill in both fields.');
        return;
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        alert('Username already exists.');
        return;
    }

    users.push({ username, password, tasks: [] });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now log in.');
    showLoginForm();
}


function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user.username;
        showTaskManager();
    } else {
        alert('Invalid username or password.');
    }
}


function logout() {
    currentUser = null;
    showLoginForm();
}


window.onload = function() {
    showLoginForm();
};


function createTask() {
    const inputField = document.getElementById('taskInput');
    const dueDateField = document.getElementById('taskDueDate');
    const taskContent = inputField.value.trim();
    const dueDate = dueDateField.value;

    if (taskContent === '') {
        alert('Please enter a task.');
        return;
    }

    const list = document.getElementById('taskList');
    const listItem = createTaskElement(taskContent, dueDate);
    list.appendChild(listItem);
    inputField.value = '';  
    dueDateField.value = ''; 

    saveTasks(); 
}


function createTaskElement(taskContent, dueDate) {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';

    const taskText = document.createElement('span');
    taskText.textContent = taskContent;
    taskText.onclick = function() {
        this.parentElement.classList.toggle('completed');
        saveTasks(); 
    };

    const dueDateText = document.createElement('span');
    dueDateText.textContent = ` (Due: ${dueDate})`;
    dueDateText.style.marginLeft = '10px'; 

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Delete';
    removeBtn.className = 'delete-btn';
    removeBtn.onclick = function() {
        this.parentElement.remove();
        saveTasks(); 
    };

    listItem.appendChild(taskText);
    listItem.appendChild(dueDateText);
    listItem.appendChild(removeBtn);
    return listItem;
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(currentUser + '_tasks')) || [];
    const list = document.getElementById('taskList');
    list.innerHTML = ''; 

    tasks.forEach(task => {
        const { content, dueDate, completed } = task;
        const listItem = createTaskElement(content, dueDate);
        if (completed) {
            listItem.classList.add('completed'); 
        }
        list.appendChild(listItem);
    });
}


function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        const taskContent = item.querySelector('span').textContent;
        const dueDate = item.querySelector('span:nth-child(2)').textContent.replace(' (Due: ', '').replace(')', '');
        const completed = item.classList.contains('completed');
        tasks.push({ content: taskContent, dueDate, completed });
    });

    const userIndex = users.findIndex(user => user.username === currentUser);
    if (userIndex !== -1) {
        users[userIndex].tasks = tasks;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem(currentUser + '_tasks', JSON.stringify(tasks)); 
    }
}
