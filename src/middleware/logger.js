/**
 * Structured JSON request logger middleware.
 * Logs method, URL, status, and duration for every HTTP request.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const log = {
      requestId: req.id || '-',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || '',
    };
    // Skip health check noise in production to keep logs clean
    if (req.originalUrl !== '/health' || process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(log));
    }
  });

  next();
}

module.exports = requestLogger;
