import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  // Log l'information de base au début de la requête
  logger.info(`Requête entrante: ${req.method} ${req.originalUrl}`);

  // Log des informations supplémentaires une fois la requête terminée
  res.on('finish', () => {
    logger.info(`Réponse envoyée: ${res.statusCode} pour ${req.method} ${req.originalUrl}`);
  });

  next();
};

export default requestLogger;