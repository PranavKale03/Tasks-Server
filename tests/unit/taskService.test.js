const taskService = require('../../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('create', () => {
    it('should create a new task with default values', () => {
      const task = taskService.create({ title: 'Test Task' });
      expect(task).toHaveProperty('id');
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.description).toBe('');
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
      expect(task.createdAt).toBeDefined();
    });

    it('should create a task with provided values', () => {
      const taskData = {
        title: 'Complete Project',
        description: 'Finish the take-home assignment',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-12-31T23:59:59Z'
      };
      const task = taskService.create(taskData);
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task.priority).toBe(taskData.priority);
      expect(task.dueDate).toBe(taskData.dueDate);
    });
  });

  describe('getAll and findById', () => {
    it('should return all tasks', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      const tasks = taskService.getAll();
      expect(tasks.length).toBe(2);
    });

    it('should find a task by id', () => {
      const task = taskService.create({ title: 'Task' });
      const found = taskService.findById(task.id);
      expect(found).toEqual(task);
    });

    it('should return undefined if task not found', () => {
      const found = taskService.findById('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update task fields', () => {
      const task = taskService.create({ title: 'Old Title' });
      const updated = taskService.update(task.id, { title: 'New Title', status: 'done' });
      expect(updated.title).toBe('New Title');
      expect(updated.status).toBe('done');
      expect(taskService.findById(task.id).title).toBe('New Title');
    });

    it('should return null if updating non-existent task', () => {
      const result = taskService.update('none', { title: 'Fail' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a task', () => {
      const task = taskService.create({ title: 'To Delete' });
      const result = taskService.remove(task.id);
      expect(result).toBe(true);
      expect(taskService.getAll().length).toBe(0);
    });

    it('should return false if removing non-existent task', () => {
      const result = taskService.remove('none');
      expect(result).toBe(false);
    });
  });

  describe('completeTask', () => {
    it('should mark task as done and set completedAt', () => {
      const task = taskService.create({ title: 'Test', priority: 'high' });
      const completed = taskService.completeTask(task.id);
      expect(completed.status).toBe('done');
      expect(completed.completedAt).toBeDefined();
    });

    it('should NOT reset priority (EXPOSING BUG-03)', () => {
      const task = taskService.create({ title: 'High Priority', priority: 'high' });
      const completed = taskService.completeTask(task.id);
      // BUG: The current implementation resets priority to 'medium'
      expect(completed.priority).toBe('high');
    });
  });

  describe('getStats', () => {
    it('should calculate stats correctly', () => {
      taskService.create({ title: 'T1', status: 'todo' });
      taskService.create({ title: 'T2', status: 'in_progress' });
      taskService.create({ title: 'T3', status: 'done' });
      taskService.create({ title: 'T4', status: 'todo', dueDate: '2000-01-01' }); // Overdue
      
      const stats = taskService.getStats();
      expect(stats.todo).toBe(2);
      expect(stats.in_progress).toBe(1);
      expect(stats.done).toBe(1);
      expect(stats.overdue).toBe(1);
    });
  });

  describe('getByStatus', () => {
    it('should filter tasks by exact status (EXPOSING BUG-02)', () => {
      taskService.create({ title: 'Todo Task', status: 'todo' });
      taskService.create({ title: 'Done Task', status: 'done' });
      
      const todoTasks = taskService.getByStatus('todo');
      expect(todoTasks.length).toBe(1);
      expect(todoTasks[0].title).toBe('Todo Task');

      // Partial match test
      const oTasks = taskService.getByStatus('o');
      // BUG: Current implementation uses includes(), so 'todo' and 'done' match 'o'
      expect(oTasks.length).toBe(0); 
    });
  });

  describe('getPaginated', () => {
    it('should return selected page and limit (EXPOSING BUG-01)', () => {
      // Create 15 tasks
      for (let i = 1; i <= 15; i++) {
        taskService.create({ title: `Task ${i}` });
      }

      // Page 1, Limit 10 -> Should be tasks 1 to 10
      const page1 = taskService.getPaginated(1, 10);
      expect(page1.length).toBe(10);
      expect(page1[0].title).toBe('Task 1'); // BUG: Currently returns Task 11-15 because offset = 1 * 10 = 10

      // Page 2, Limit 10 -> Should be tasks 11 to 15
      const page2 = taskService.getPaginated(2, 10);
      expect(page2.length).toBe(5);
      expect(page2[0].title).toBe('Task 11');
    });
  });

  describe('assignTask', () => {
    it('should assign a task to a user', () => {
      const task = taskService.create({ title: 'Task' });
      const updated = taskService.assignTask(task.id, 'Alice');
      expect(updated.assignee).toBe('Alice');
      expect(taskService.findById(task.id).assignee).toBe('Alice');
    });

    it('should return null if task not found', () => {
      const result = taskService.assignTask('invalid', 'Alice');
      expect(result).toBeNull();
    });
  });
});
