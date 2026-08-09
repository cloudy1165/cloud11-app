const requestId = require('../src/middleware/requestId');

describe('requestId middleware', () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  it('should call next()', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    requestId(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should generate a UUIDv4 and attach to req.id', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    requestId(req, res, next);
    expect(req.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('should set X-Request-Id response header', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    requestId(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', req.id);
  });

  it('should pass through a client-supplied X-Request-Id', () => {
    const clientId = 'my-trace-id-12345';
    const req = { headers: { 'x-request-id': clientId } };
    const res = { setHeader: jest.fn() };
    requestId(req, res, next);
    expect(req.id).toBe(clientId);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', clientId);
  });

  it('each request should get a unique ID', () => {
    const ids = new Set();
    for (let i = 0; i < 10; i++) {
      const req = { headers: {} };
      const res = { setHeader: jest.fn() };
      requestId(req, res, next);
      ids.add(req.id);
    }
    expect(ids.size).toBe(10);
  });
});
