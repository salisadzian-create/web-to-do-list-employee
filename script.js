let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];

const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date-input');
const btnSubmit = document.getElementById('btn-submit');
const btnDeleteAll = document.getElementById('btn-delete-all');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const currentTimeEl = document.getElementById('current-time');

const userNameEl = document.getElementById('user-name');
const userRoleEl = document.getElementById('user-role');
const btnEditProfile = document.getElementById('btn-edit-profile');

function saveToLocalStorage() {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

function initTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    currentTimeEl.textContent = now.toLocaleDateString('id-ID', options);
}

function formatDate(dateObj) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return dateObj.toLocaleDateString('id-ID', options);
}

function addTask() {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (!text) {
        alert('Mohon isi deskripsi tugas terlebih dahulu!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        createdDate: formatDate(new Date()),
        dueDate: dueDate ? dueDate : null,
        isDone: false
    };

    tasks.push(newTask);
    saveToLocalStorage(); 
    clearForm();
    renderTasks();
}

function clearForm() {
    taskInput.value = '';
    prioritySelect.value = 'Low';
    dueDateInput.value = '';
}

function isOverdue(task) {
    if (!task.dueDate || task.isDone) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0);

    return taskDueDate < today;
}

function renderTasks() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        const overdue = isOverdue(task);
        
        li.className = `task-item ${overdue ? 'overdue' : ''}`;
        const badgeClass = `badge-${task.priority.toLowerCase()}`;
        
        let dueDateText = '';
        if (task.dueDate) {
            dueDateText = ` | Due: ${formatDate(new Date(task.dueDate))}`;
        }

        li.innerHTML = `
            <input type="checkbox" ${task.isDone ? 'checked' : ''} onchange="toggleTaskStatus(${task.id})">
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="badge ${badgeClass}">${task.priority}</span>
                    ${overdue ? '<span class="badge badge-overdue">LATE</span>' : ''}
                    <span class="task-date">${task.createdDate}${dueDateText}</span>
                </div>
            </div>
            <button class="btn-delete-item" onclick="deleteTask(${task.id})" title="Hapus Task">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        if (task.isDone) {
            doneList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });
}

function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, isDone: !task.isDone };
        }
        return task;
    });
    saveToLocalStorage(); 
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage(); 
    renderTasks();
}

function deleteAllTasks() {
    if (tasks.length === 0) {
        alert('Tidak ada agenda untuk dihapus.');
        return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus SELURUH agenda to-do list?')) {
        tasks = [];
        saveToLocalStorage();
        renderTasks();
    }
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}


function loadUserProfile() {
    const savedName = localStorage.getItem('todo_user_name');
    const savedRole = localStorage.getItem('todo_user_role');

    if (savedName) userNameEl.textContent = savedName;
    if (savedRole) userRoleEl.textContent = savedRole;
}

if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
        const newName = prompt('Masukkan nama Anda:', userNameEl.textContent);
        const newRole = prompt('Masukkan jabatan Anda:', userRoleEl.textContent);

        if (newName && newName.trim() !== '') {
            userNameEl.textContent = newName.trim();
            localStorage.setItem('todo_user_name', newName.trim());
        }
        
        if (newRole && newRole.trim() !== '') {
            userRoleEl.textContent = newRole.trim();
            localStorage.setItem('todo_user_role', newRole.trim());
        }
    });
}

btnSubmit.addEventListener('click', addTask);
btnDeleteAll.addEventListener('click', deleteAllTasks);

initTime();
renderTasks();
loadUserProfile(); 