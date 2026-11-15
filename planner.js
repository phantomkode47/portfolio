// ===== Academic Planner: add, complete, delete tasks =====
let tasks = [];            // array of task objects
let filter = "all";        // all | active | done

const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const fill = document.getElementById("progressFill");
const pctText = document.getElementById("progressText");
const formError = document.getElementById("taskError");

function load() {
  try { tasks = JSON.parse(localStorage.getItem("planner_tasks")) || []; } catch (e) { tasks = []; }
}
function save() {
  try { localStorage.setItem("planner_tasks", JSON.stringify(tasks)); } catch (e) { /* ignore */ }
}

function addTask(title, course, priority, due) {
  tasks.push({ id: Date.now(), title, course, priority, due, done: false });
  save(); render();
}
function toggleTask(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) t.done = !t.done;
  save(); render();
}
function deleteTask(id) {
  tasks = tasks.filter((x) => x.id !== id);
  save(); render();
}

function render() {
  list.innerHTML = "";
  const today = new Date().toISOString().slice(0, 10);
  const visible = tasks.filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done));

  if (visible.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = tasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing in this view.";
    list.appendChild(li);
  }

  visible.forEach((t) => {
    const li = document.createElement("li");
    li.className = "task" + (t.done ? " done" : "") + (!t.done && t.due && t.due < today ? " overdue" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.done;
    cb.setAttribute("aria-label", "Mark " + t.title + " as completed");
    cb.addEventListener("change", () => toggleTask(t.id));

    const info = document.createElement("div");
    info.className = "info";
    const name = document.createElement("div");
    name.className = "name"; name.textContent = t.title;   // textContent prevents HTML injection
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = (t.course ? t.course + " • " : "");
    const due = document.createElement("span");
    due.className = "due";
    due.textContent = t.due ? "Due " + t.due + (!t.done && t.due < today ? " (overdue)" : "") : "No due date";
    meta.appendChild(due);
    info.append(name, meta);

    const pri = document.createElement("span");
    pri.className = "pri " + t.priority; pri.textContent = t.priority;

    const del = document.createElement("button");
    del.className = "del"; del.type = "button"; del.textContent = "✕";
    del.setAttribute("aria-label", "Delete " + t.title);
    del.addEventListener("click", () => deleteTask(t.id));

    li.append(cb, info, pri, del);
    list.appendChild(li);
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  counter.textContent = doneCount + " of " + tasks.length + " completed";
  fill.style.width = pct + "%";
  pctText.textContent = pct + "% done";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = form.elements.title.value.trim();
  if (!title) {
    formError.textContent = "Please type a task first.";
    form.elements.title.focus();
    return;
  }
  formError.textContent = "";
  addTask(title, form.elements.course.value.trim(), form.elements.priority.value, form.elements.due.value);
  form.reset();
  form.elements.title.focus();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    filter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === chip));
    render();
  });
});

document.getElementById("clearDone").addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save(); render();
});

load();
render();
