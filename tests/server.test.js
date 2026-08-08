const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
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

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'Test Note', completed: false });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Note');
    expect(res.body.id).toBeDefined();
  });

  it('should update a note', async () => {
    const res = await request(app)
      .put('/api/notes/1')
      .send({ completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('should delete a note', async () => {
    const res = await request(app).delete('/api/notes/3');
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 for non-existent note', async () => {
    const res = await request(app).get('/api/notes/999');
    expect(res.statusCode).toBe(404);
  });
});
