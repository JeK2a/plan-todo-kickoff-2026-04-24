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

function visibleTasks() {
  if (state.filter === "active") {
    return state.tasks.filter((task) => !task.done);
  }
  if (state.filter === "done") {
    return state.tasks.filter((task) => task.done);
  }
  return state.tasks;
}

function render() {
  const tasks = visibleTasks();
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
      state.tasks = state.tasks.map((itemTask) =>
        itemTask.id === task.id ? { ...itemTask, done: !itemTask.done } : itemTask,
      );
      persistTasks();
      render();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => {
      state.tasks = state.tasks.filter((itemTask) => itemTask.id !== task.id);
      persistTasks();
      render();
    });

    actions.append(toggle, remove);
    item.append(title, actions);
    taskList.append(item);
  });

  const doneCount = state.tasks.filter((task) => task.done).length;
  taskStats.textContent = `${state.tasks.length} задач, выполнено: ${doneCount}`;

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

  state.tasks = [
    {
      id: crypto.randomUUID(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    },
    ...state.tasks,
  ];
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
  state.tasks = state.tasks.filter((task) => !task.done);
  persistTasks();
  render();
});

render();
