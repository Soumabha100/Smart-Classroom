/**
 * Global Error Handler Middleware
 *
 * This middleware catches all errors thrown in async controllers
 * and sends a consistent JSON response to the client.
 *
 * Must be registered LAST in server.js:
 *   app.use(errorHandler);
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Log error for debugging (only show stack in development)
  console.error(`[Error] ${statusCode}: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
