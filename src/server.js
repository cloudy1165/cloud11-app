const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

const notesRouter = require('./routes/notes');
const requestLogger = require('./middleware/logger');
const requestId = require('./middleware/requestId');
const { metricsMiddleware, register } = require('./middleware/metrics');
const swaggerDefinition = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

// Rate limit: 100 requests per minute per IP (excludes /health and /metrics)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => ['/health', '/metrics'].includes(req.path),
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ── Request parsing & correlation ───────────────────────────────────────────
app.use(express.json());
app.use(requestId);
app.use(requestLogger);
app.use(metricsMiddleware);

// ── API Docs ─────────────────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
  customSiteTitle: 'Cloud11 API Docs',
}));

// ── Observability endpoints ──────────────────────────────────────────────────
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/health', (req, res) => {
  const mem = process.memoryUsage();
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.APP_VERSION || '1.0.0',
    node: process.version,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
    },
  });
});

app.use('/api/version', (req, res) => {
  res.json({
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    node: process.version,
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/notes', notesRouter);

// ── Error handlers ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`${process.env.APP_NAME || 'Server'} running on port ${PORT}`);
    console.log(`  API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`  Metrics:  http://localhost:${PORT}/metrics`);
  });
}

module.exports = app;
