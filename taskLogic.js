export function filterTasks(tasks, filter) {
  if (filter === "active") {
    return tasks.filter((task) => !task.done);
  }
  if (filter === "done") {
    return tasks.filter((task) => task.done);
  }
  return tasks;
}

export function addTask(tasks, title, idFactory, dueDate = null) {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return tasks;
  }

  return [
    {
      id: idFactory(),
      title: normalizedTitle,
      done: false,
      dueDate: normalizeDueDate(dueDate),
      createdAt: new Date().toISOString(),
    },
    ...tasks,
  ];
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function editTaskTitle(tasks, id, nextTitle) {
  const normalizedTitle = nextTitle.trim();
  if (!normalizedTitle) {
    return tasks;
  }

  return tasks.map((task) =>
    task.id === id ? { ...task, title: normalizedTitle } : task,
  );
}

export function editTaskDueDate(tasks, id, nextDueDate) {
  const normalizedDueDate = normalizeDueDate(nextDueDate);
  return tasks.map((task) =>
    task.id === id ? { ...task, dueDate: normalizedDueDate } : task,
  );
}

export function normalizeDueDate(rawDueDate) {
  if (!rawDueDate) {
    return null;
  }
  const normalized = rawDueDate.trim();
  if (!normalized) {
    return null;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

export function isTaskOverdue(task, todayDateString = getTodayLocalDateString()) {
  if (task.done || !task.dueDate) {
    return false;
  }
  return task.dueDate < todayDateString;
}

export function sanitizeImportedTasks(rawTasks) {
  if (!Array.isArray(rawTasks)) {
    throw new Error("Неверный формат: ожидается массив задач.");
  }

  return rawTasks.map((task, index) => {
    if (!task || typeof task !== "object") {
      throw new Error(`Неверный формат задачи на позиции ${index + 1}.`);
    }

    const title = typeof task.title === "string" ? task.title.trim() : "";
    if (!title) {
      throw new Error(`Пустой заголовок задачи на позиции ${index + 1}.`);
    }

    const id =
      typeof task.id === "string" && task.id.trim()
        ? task.id
        : `imported-${index + 1}-${Date.now()}`;
    const done = Boolean(task.done);
    const dueDate = normalizeDueDate(task.dueDate ?? null);
    const createdAt =
      typeof task.createdAt === "string" && task.createdAt.trim()
        ? task.createdAt
        : new Date().toISOString();

    return {
      id,
      title,
      done,
      dueDate,
      createdAt,
    };
  });
}

function getTodayLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function clearDone(tasks) {
  return tasks.filter((task) => !task.done);
}

export function doneCount(tasks) {
  return tasks.filter((task) => task.done).length;
}
