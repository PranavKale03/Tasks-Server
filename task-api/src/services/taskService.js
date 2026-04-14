const { v4: uuidv4 } = require('uuid');

let tasks = [];

/**
 * Get all tasks from the store.
 * @returns {Array} List of all tasks.
 */
const getAll = () => [...tasks];

/**
 * Find a task by its unique identifier.
 * @param {string} id - The task ID.
 * @returns {Object|undefined} The found task or undefined.
 */
const findById = (id) => tasks.find((t) => t.id === id);

/**
 * Filter tasks by their status.
 * @param {string} status - The status to filter by (todo|in_progress|done).
 * @returns {Array} List of matching tasks.
 */
const getByStatus = (status) => tasks.filter((t) => t.status === status);

/**
 * Get a paginated list of tasks.
 * @param {number} page - The page number (1-based).
 * @param {number} limit - Items per page.
 * @returns {Array} Slice of tasks for the requested page.
 */
const getPaginated = (page, limit) => {
  const offset = (page - 1) * limit;
  return tasks.slice(offset, offset + limit);
};

/**
 * Get summary statistics for all tasks.
 * @returns {Object} Counts by status and overdue count.
 */
const getStats = () => {
  const now = new Date();
  const counts = { todo: 0, in_progress: 0, done: 0 };
  let overdue = 0;

  tasks.forEach((t) => {
    if (counts[t.status] !== undefined) counts[t.status]++;
    if (t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now) {
      overdue++;
    }
  });

  return { ...counts, overdue };
};

/**
 * Create a new task.
 * @param {Object} data - The task data.
 * @param {string} data.title - Task title.
 * @param {string} [data.description] - Task description.
 * @param {string} [data.status] - Initial status.
 * @param {string} [data.priority] - Task priority.
 * @param {string|null} [data.dueDate] - Optional due date.
 * @returns {Object} The newly created task.
 */
const create = ({ title, description = '', status = 'todo', priority = 'medium', dueDate = null }) => {
  const task = {
    id: uuidv4(),
    title,
    description,
    status,
    priority,
    dueDate,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
};

/**
 * Update an existing task.
 * @param {string} id - Task ID.
 * @param {Object} fields - Fields to update.
 * @returns {Object|null} Updated task or null if not found.
 */
const update = (id, fields) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated = { ...tasks[index], ...fields };
  tasks[index] = updated;
  return updated;
};

/**
 * Delete a task.
 * @param {string} id - Task ID.
 * @returns {boolean} True if deleted, false if not found.
 */
const remove = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
};

/**
 * Mark a task as complete.
 * @param {string} id - Task ID.
 * @returns {Object|null} Updated task or null if not found.
 */
const completeTask = (id) => {
  const task = findById(id);
  if (!task) return null;

  const updated = {
    ...task,
    status: 'done',
    completedAt: new Date().toISOString(),
  };

  const index = tasks.findIndex((t) => t.id === id);
  tasks[index] = updated;
  return updated;
};

/**
 * Assign a task to a user.
 * @param {string} id - Task ID.
 * @param {string} assignee - Name of the assignee.
 * @returns {Object|null} Updated task or null if not found.
 */
const assignTask = (id, assignee) => {
  const task = findById(id);
  if (!task) return null;

  const updated = {
    ...task,
    assignee,
  };

  const index = tasks.findIndex((t) => t.id === id);
  tasks[index] = updated;
  return updated;
};

const _reset = () => {
  tasks = [];
};

module.exports = {
  getAll,
  findById,
  getByStatus,
  getPaginated,
  getStats,
  create,
  update,
  remove,
  completeTask,
  assignTask,
  _reset,
};
