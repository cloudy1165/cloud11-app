/**
 * Assigns a unique X-Request-Id to every incoming request.
 * - Uses the client-supplied header if present (allows tracing across services).
 * - Generates a new UUIDv4 using Node.js built-in crypto.randomUUID() otherwise.
 * The ID is attached to req.id and echoed back in the response header.
 */
function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

module.exports = requestId;
