const request = require('supertest');
const app = require('../src/server');

describe('Metrics endpoint', () => {
  it('should return Prometheus text format', async () => {
    // Hit a few routes first so metrics are populated
    await request(app).get('/health');
    await request(app).get('/api/notes');

    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toMatch(/http_requests_total/);
    expect(res.text).toMatch(/http_request_duration_seconds/);
    expect(res.text).toMatch(/process_cpu_seconds_total/);
  });
});

describe('Rate limiting', () => {
  it('should include RateLimit headers on API responses', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    // express-rate-limit v7+ uses RateLimit-* standard headers
    expect(res.headers['ratelimit-limit'] || res.headers['x-ratelimit-limit']).toBeDefined();
  });
});

describe('Request ID', () => {
  it('should return X-Request-Id header on every response', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('should echo back a client-supplied X-Request-Id', async () => {
    const clientId = 'test-trace-abc-123';
    const res = await request(app)
      .get('/api/notes')
      .set('X-Request-Id', clientId);
    expect(res.headers['x-request-id']).toBe(clientId);
  });
});

describe('Swagger docs', () => {
  it('should serve the API docs page', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/swagger/i);
  });
});
