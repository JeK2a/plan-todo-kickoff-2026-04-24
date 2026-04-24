import test from "node:test";
import assert from "node:assert/strict";
import {
  addTask,
  clearDone,
  doneCount,
  filterTasks,
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
  const result = addTask(sampleTasks, "  Новая задача  ", () => "new-id");
  assert.equal(result.length, 3);
  assert.equal(result[0].id, "new-id");
  assert.equal(result[0].title, "Новая задача");
  assert.equal(result[0].done, false);
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

test("clearDone keeps only active tasks", () => {
  const result = clearDone(sampleTasks);
  assert.deepEqual(result, [sampleTasks[0]]);
});

test("doneCount counts completed tasks", () => {
  assert.equal(doneCount(sampleTasks), 1);
});
