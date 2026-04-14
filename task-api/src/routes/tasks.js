const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const { validateCreateTask, validateUpdateTask, validateAssignTask } = require('../utils/validators');

/**
 * @route GET /tasks/stats
 * @desc Get task counts by status and overdue count
 */
router.get('/stats', (req, res) => {
  const stats = taskService.getStats();
  res.json(stats);
});

/**
 * @route GET /tasks
 * @desc List all tasks with optional status filtering or pagination
 * @query {string} [status] - Filter by task status
 * @query {number} [page] - Page number for pagination
 * @query {number} [limit] - Max items per page
 */
router.get('/', (req, res) => {
  const { status, page, limit } = req.query;

  if (status) {
    const tasks = taskService.getByStatus(status);
    return res.json(tasks);
  }

  if (page !== undefined || limit !== undefined) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const tasks = taskService.getPaginated(pageNum, limitNum);
    return res.json(tasks);
  }

  const tasks = taskService.getAll();
  res.json(tasks);
});

/**
 * @route POST /tasks
 * @desc Create a new task
 * @body {string} title - Task title (required)
 * @body {string} [description] - Task description
 * @body {string} [status] - Initial status (todo|in_progress|done)
 * @body {string} [priority] - Task priority (low|medium|high)
 * @body {string} [dueDate] - Optional ISO date string
 */
router.post('/', (req, res) => {
  const error = validateCreateTask(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const task = taskService.create(req.body);
  res.status(201).json(task);
});

/**
 * @route PUT /tasks/:id
 * @desc Update an existing task (full update)
 * @param {string} id - Task ID
 */
router.put('/:id', (req, res) => {
  const error = validateUpdateTask(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const task = taskService.update(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

/**
 * @route DELETE /tasks/:id
 * @desc Delete a task
 * @param {string} id - Task ID
 */
router.delete('/:id', (req, res) => {
  const deleted = taskService.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

/**
 * @route PATCH /tasks/:id/complete
 * @desc Mark a task as complete
 * @param {string} id - Task ID
 */
router.patch('/:id/complete', (req, res) => {
  const task = taskService.completeTask(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

/**
 * @route PATCH /tasks/:id/assign
 * @desc Assign a task to a user
 * @param {string} id - Task ID
 * @body {string} assignee - Name of the assignee (required)
 */
router.patch('/:id/assign', (req, res) => {
  const error = validateAssignTask(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const task = taskService.assignTask(req.params.id, req.body.assignee);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

module.exports = router;
