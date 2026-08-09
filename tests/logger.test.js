const requestLogger = require('../src/middleware/logger');

describe('requestLogger middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/api/notes',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest-test' },
    };
    res = {
      statusCode: 200,
      on: jest.fn((event, cb) => {
        if (event === 'finish') cb();
      }),
    };
    next = jest.fn();
  });

  it('should call next()', () => {
    requestLogger(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should attach a finish listener on the response', () => {
    requestLogger(req, res, next);
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should log a structured JSON object on finish', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    requestLogger(req, res, next);
    expect(spy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged).toMatchObject({
      method: 'GET',
      url: '/api/notes',
      status: 200,
    });
    expect(typeof logged.durationMs).toBe('number');
    expect(logged.timestamp).toBeDefined();
    spy.mockRestore();
  });

  it('should suppress /health logs in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    req.originalUrl = '/health';
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    requestLogger(req, res, next);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('should log /health in non-production environments', () => {
    process.env.NODE_ENV = 'test';
    req.originalUrl = '/health';
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    requestLogger(req, res, next);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('should fallback ip from x-forwarded-for header', () => {
    req.ip = undefined;
    req.headers['x-forwarded-for'] = '10.0.0.1';
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    requestLogger(req, res, next);
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.ip).toBe('10.0.0.1');
    spy.mockRestore();
  });
});
