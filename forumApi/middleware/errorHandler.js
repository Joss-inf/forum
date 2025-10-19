import logger from '../utils/logger.js';
import  CONFIG  from '../config/config.js';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur interne est survenue.';

  logger.error(`${statusCode} - ${message} - ${req.method} ${req.originalUrl} - ${err.stack}`);

  const isProd = CONFIG.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: isProd && statusCode === 500
      ? 'Une erreur interne est survenue.'
      : message
  });
}
