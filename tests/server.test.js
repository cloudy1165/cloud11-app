const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  it('should return 200 OK with rich status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.version).toBeDefined();
    expect(res.body.node).toMatch(/^v\d+/);
    expect(res.body.memory).toBeDefined();
    expect(res.body.memory.rss).toMatch(/MB$/);
  });
});

describe('Version Endpoint', () => {
  it('should return version info', async () => {
    const res = await request(app).get('/api/version');
    expect(res.statusCode).toBe(200);
    expect(res.body.version).toBeDefined();
    expect(res.body.environment).toBeDefined();
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.node).toMatch(/^v\d+/);
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});

describe('Notes API', () => {
  it('should get all notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single note', async () => {
    const res = await request(app).get('/api/notes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBeDefined();
  });

  it('should return 404 for non-existent note', async () => {
    const res = await request(app).get('/api/notes/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Note not found');
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'Test Note', completed: false });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Note');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
  });

  it('should return 400 when creating a note without title', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ completed: false });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  it('should default completed to false when not provided', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'No Completed Field' });
    expect(res.statusCode).toBe(201);
    expect(res.body.completed).toBe(false);
  });

  it('should update a note title', async () => {
    const res = await request(app)
      .put('/api/notes/1')
      .send({ title: 'Updated Title' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should update a note completed status', async () => {
    const res = await request(app)
      .put('/api/notes/1')
      .send({ completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('should return 404 when updating non-existent note', async () => {
    const res = await request(app)
      .put('/api/notes/999')
      .send({ title: 'Ghost Note' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Note not found');
  });

  it('should delete a note', async () => {
    const res = await request(app).delete('/api/notes/3');
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 when deleting non-existent note', async () => {
    const res = await request(app).delete('/api/notes/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Note not found');
  });
});
