const request = require('supertest');
const app = require('../../src/app');
const taskService = require('../../src/services/taskService');

describe('Task Routes Integration', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('POST /tasks', () => {
    it('should create a task and return 201', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'New Task', priority: 'high' });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Task');
      expect(res.body.priority).toBe('high');
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: '' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /tasks', () => {
    beforeEach(() => {
      taskService.create({ title: 'T1', status: 'todo' });
      taskService.create({ title: 'T2', status: 'done' });
    });

    it('should return all tasks', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should filter by status', async () => {
      const res = await request(app).get('/tasks?status=todo');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('T1');
    });

    it('should handle pagination (EXPOSING BUG-01)', async () => {
      // Create more tasks to test pagination
      for (let i = 3; i <= 15; i++) {
        taskService.create({ title: `T${i}` });
      }
      const res = await request(app).get('/tasks?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
      expect(res.body[0].title).toBe('T1'); // BUG: Will fail as it returns T11
    });
  });

  describe('GET /tasks/stats', () => {
    it('should return stats', async () => {
      taskService.create({ title: 'T1', status: 'todo' });
      const res = await request(app).get('/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body.todo).toBe(1);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const task = taskService.create({ title: 'Old' });
      const res = await request(app)
        .put(`/tasks/${task.id}`)
        .send({ title: 'New' });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put('/tasks/invalid-id')
        .send({ title: 'New' });
      
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task and return 204', async () => {
      const task = taskService.create({ title: 'Delete Me' });
      const res = await request(app).delete(`/tasks/${task.id}`);
      expect(res.status).toBe(204);
      expect(taskService.findById(task.id)).toBeUndefined();
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    it('should mark task as complete', async () => {
      const task = taskService.create({ title: 'Pending' });
      const res = await request(app).patch(`/tasks/${task.id}/complete`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('done');
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    it('should assign a task to a user', async () => {
      const task = taskService.create({ title: 'T1' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: 'Bob' });
      
      expect(res.status).toBe(200);
      expect(res.body.assignee).toBe('Bob');
    });

    it('should return 400 for missing assignee', async () => {
      const task = taskService.create({ title: 'T1' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: '' });
      
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .patch('/tasks/invalid/assign')
        .send({ assignee: 'Bob' });
      
      expect(res.status).toBe(404);
    });
  });
});
