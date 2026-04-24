import test from "node:test";
import assert from "node:assert/strict";
import {
  addTask,
  clearDone,
  doneCount,
  editTaskTitle,
  editTaskDueDate,
  filterTasks,
  isTaskOverdue,
  normalizeDueDate,
  removeTask,
  toggleTask,
} from "./taskLogic.js";

const sampleTasks = [
  { id: "1", title: "A", done: false, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", title: "B", done: true, createdAt: "2026-01-01T00:01:00.000Z" },
];

test("filterTasks returns active tasks", () => {
  const result = filterTasks(sampleTasks, "active");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "1");
});

test("filterTasks returns done tasks", () => {
  const result = filterTasks(sampleTasks, "done");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "2");
});

test("addTask prepends new normalized task", () => {
  const result = addTask(sampleTasks, "  Новая задача  ", () => "new-id", "2026-05-01");
  assert.equal(result.length, 3);
  assert.equal(result[0].id, "new-id");
  assert.equal(result[0].title, "Новая задача");
  assert.equal(result[0].done, false);
  assert.equal(result[0].dueDate, "2026-05-01");
});

test("toggleTask flips done flag by id", () => {
  const result = toggleTask(sampleTasks, "1");
  assert.equal(result[0].done, true);
  assert.equal(result[1].done, true);
});

test("removeTask removes only selected task", () => {
  const result = removeTask(sampleTasks, "2");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "1");
});

test("editTaskTitle updates title and trims value", () => {
  const result = editTaskTitle(sampleTasks, "1", "  Обновлено  ");
  assert.equal(result[0].title, "Обновлено");
  assert.equal(result[1].title, "B");
});

test("editTaskTitle does not save empty value", () => {
  const result = editTaskTitle(sampleTasks, "1", "   ");
  assert.deepEqual(result, sampleTasks);
});

test("editTaskDueDate updates due date", () => {
  const result = editTaskDueDate(sampleTasks, "1", "2026-06-10");
  assert.equal(result[0].dueDate, "2026-06-10");
});

test("normalizeDueDate returns null for invalid value", () => {
  assert.equal(normalizeDueDate("10.06.2026"), null);
});

test("isTaskOverdue returns true for overdue active task", () => {
  const task = { id: "1", title: "A", done: false, dueDate: "2026-01-01" };
  assert.equal(isTaskOverdue(task, "2026-01-02"), true);
});

test("isTaskOverdue returns false for done task", () => {
  const task = { id: "1", title: "A", done: true, dueDate: "2026-01-01" };
  assert.equal(isTaskOverdue(task, "2026-01-02"), false);
});

test("clearDone keeps only active tasks", () => {
  const result = clearDone(sampleTasks);
  assert.deepEqual(result, [sampleTasks[0]]);
});

test("doneCount counts completed tasks", () => {
  assert.equal(doneCount(sampleTasks), 1);
});
