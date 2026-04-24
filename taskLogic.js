export function filterTasks(tasks, filter) {
  if (filter === "active") {
    return tasks.filter((task) => !task.done);
  }
  if (filter === "done") {
    return tasks.filter((task) => task.done);
  }
  return tasks;
}

export function addTask(tasks, title, idFactory) {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return tasks;
  }

  return [
    {
      id: idFactory(),
      title: normalizedTitle,
      done: false,
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

export function clearDone(tasks) {
  return tasks.filter((task) => !task.done);
}

export function doneCount(tasks) {
  return tasks.filter((task) => task.done).length;
}
