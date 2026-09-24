// Taskboard — AUREX Week 4 (Vanilla JS, DOM, localStorage)
const STORAGE_KEY = "aurex-tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const errorBox = document.getElementById("error");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const list = document.getElementById("task-list");
const emptyMsg = document.getElementById("empty");
const summary = document.getElementById("summary");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = loadTasks();
let currentFilter = "all";
let editingId = null;

// ---------- localStorage ----------
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    showError("Could not save tasks. Your browser storage may be full or blocked.");
  }
}

// ---------- Validation ----------
function validate(text) {
  if (text === "") return "Task cannot be empty. Type something to do.";
  if (text.length < 3) return "Task must be at least 3 characters.";
  const duplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase() && t.id !== editingId);
  if (duplicate) return "This task already exists.";
  return "";
}

function showError(msg) {
  errorBox.textContent = msg;
  input.classList.toggle("invalid", msg !== "");
}

// ---------- CRUD ----------
function addTask(text) {
  tasks.push({ id: Date.now(), text, completed: false });
}

function updateTask(id, text) {
  const task = tasks.find(t => t.id === id);
  if (task) task.text = text;
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  if (editingId === id) stopEditing();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
}

function startEditing(task) {
  editingId = task.id;
  input.value = task.text;
  submitBtn.textContent = "Save changes";
  cancelBtn.hidden = false;
  showError("");
  input.focus();
}

function stopEditing() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Add task";
  cancelBtn.hidden = true;
  showError("");
}

// ---------- Rendering ----------
function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter(t => !t.completed);
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  return tasks;
}

function makeButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

function render() {
  list.innerHTML = "";
  const visible = getVisibleTasks();

  visible.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("done");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.completed;
    check.setAttribute("aria-label", `Mark "${task.text}" as complete`);
    check.addEventListener("change", () => { toggleTask(task.id); saveTasks(); render(); });

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      makeButton("Edit", "edit", () => startEditing(task)),
      makeButton("Delete", "delete", () => { deleteTask(task.id); saveTasks(); render(); })
    );

    li.append(check, span, actions);
    list.appendChild(li);
  });

  const messages = {
    all: "No tasks yet. Add your first one above.",
    active: "Nothing left to do. Nice work.",
    completed: "No completed tasks yet."
  };
  emptyMsg.hidden = visible.length > 0;
  emptyMsg.textContent = messages[currentFilter];

  const done = tasks.filter(t => t.completed).length;
  summary.textContent = tasks.length ? `${done} of ${tasks.length} completed` : "";
}

// ---------- Events ----------
form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  const message = validate(text);
  if (message) { showError(message); return; }

  if (editingId !== null) updateTask(editingId, text);
  else addTask(text);

  saveTasks();
  stopEditing();
  render();
});

input.addEventListener("input", () => { if (errorBox.textContent) showError(""); });
cancelBtn.addEventListener("click", stopEditing);
input.addEventListener("keydown", e => { if (e.key === "Escape" && editingId !== null) stopEditing(); });

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    render();
  });
});

render();