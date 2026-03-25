let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Debounce function
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Add Task
function addTask() {
  const title = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (!title) return alert("Task cannot be empty!");

  tasks.push({
    id: Date.now(),
    title,
    priority,
    deadline,
    completed: false
  });

  saveTasks();
  renderTasks();

  document.getElementById("taskInput").value = "";
}

// Save
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toggle Complete
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Filter (with debounce)
const setFilter = debounce(function(type) {
  filter = type;
  renderTasks();
}, 300);

// Sorting
function sortTasks(type) {
  if (type === "priority") {
    const order = { High: 3, Medium: 2, Low: 1 };
    tasks.sort((a, b) => order[b.priority] - order[a.priority]);
  } else {
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }
  renderTasks();
}

// Render
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;

  if (filter === "completed") filtered = tasks.filter(t => t.completed);
  if (filter === "pending") filtered = tasks.filter(t => !t.completed);

  filtered.forEach(task => {
    const isOverdue = task.deadline && new Date(task.deadline) < new Date();

    const priorityClass =
      task.priority === "High" ? "danger" :
      task.priority === "Medium" ? "warning" : "success";

    list.innerHTML += `
      <div class="card mb-2 ${isOverdue ? 'border-danger' : ''}">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="${task.completed ? 'text-decoration-line-through text-muted' : ''}">
              ${task.title}
            </h5>
            <span class="badge bg-${priorityClass}">${task.priority}</span>
            <small class="ms-2">📅 ${task.deadline || "No deadline"}</small>
          </div>
          <div>
            <button onclick="toggleTask(${task.id})" class="btn btn-success btn-sm">✔</button>
            <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-sm">🗑</button>
          </div>
        </div>
      </div>
    `;
  });

  updateCounter();
}

// Counter
function updateCounter() {
  document.getElementById("total").innerText = tasks.length;
  document.getElementById("completed").innerText = tasks.filter(t => t.completed).length;
  document.getElementById("pending").innerText = tasks.filter(t => !t.completed).length;
}

// Initial render
renderTasks();