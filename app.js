import {
  addTask,
  clearDone,
  doneCount,
  filterTasks,
  removeTask,
  toggleTask,
} from "./taskLogic.js";

const STORAGE_KEY = "todo-mvp.tasks";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-title");
const taskList = document.querySelector("#task-list");
const taskStats = document.querySelector("#task-stats");
const clearDoneButton = document.querySelector("#clear-done");
const filterButtons = document.querySelectorAll(".filter-button");

let state = {
  filter: "all",
  tasks: loadTasks(),
};

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function render() {
  const tasks = filterTasks(state.tasks, state.filter);
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item";

    const title = document.createElement("span");
    title.className = `task-title ${task.done ? "is-done" : ""}`.trim();
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = task.done ? "Вернуть" : "Готово";
    toggle.addEventListener("click", () => {
      state.tasks = toggleTask(state.tasks, task.id);
      persistTasks();
      render();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => {
      state.tasks = removeTask(state.tasks, task.id);
      persistTasks();
      render();
    });

    actions.append(toggle, remove);
    item.append(title, actions);
    taskList.append(item);
  });

  const doneTasks = doneCount(state.tasks);
  taskStats.textContent = `${state.tasks.length} задач, выполнено: ${doneTasks}`;

  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    return;
  }

  state.tasks = addTask(state.tasks, title, () => crypto.randomUUID());
  persistTasks();
  form.reset();
  input.focus();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    render();
  });
});

clearDoneButton.addEventListener("click", () => {
  state.tasks = clearDone(state.tasks);
  persistTasks();
  render();
});

render();
