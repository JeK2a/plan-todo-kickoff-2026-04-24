import {
  addTask,
  clearDone,
  doneCount,
  editTaskTitle,
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
  editingTaskId: null,
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
    const isEditing = state.editingTaskId === task.id;
    let titleInput;
    if (isEditing) {
      titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.value = task.title;
      titleInput.className = "task-edit-input";
      titleInput.setAttribute("aria-label", "Редактировать задачу");
      queueMicrotask(() => titleInput.focus());
    }

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

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = isEditing ? "Сохранить" : "Редактировать";
    edit.addEventListener("click", () => {
      if (!isEditing) {
        state.editingTaskId = task.id;
        render();
        return;
      }

      state.tasks = editTaskTitle(state.tasks, task.id, titleInput.value);
      state.editingTaskId = null;
      persistTasks();
      render();
    });

    if (isEditing) {
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = "Отмена";
      cancel.addEventListener("click", () => {
        state.editingTaskId = null;
        render();
      });
      titleInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          state.tasks = editTaskTitle(state.tasks, task.id, titleInput.value);
          state.editingTaskId = null;
          persistTasks();
          render();
        }
        if (event.key === "Escape") {
          state.editingTaskId = null;
          render();
        }
      });
      actions.append(toggle, edit, cancel, remove);
      item.append(titleInput, actions);
    } else {
      actions.append(toggle, edit, remove);
      item.append(title, actions);
    }
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
  state.editingTaskId = null;
  persistTasks();
  render();
});

render();
