
import express from 'ultimate-express'
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js'; 
import requestLogger from './middleware/requestLogger.js'; 
import apiRoutes from './features/index.js'
import corsMiddleware from './middleware/cors.Middleware.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import  CONFIG  from './config/config.js';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  ...(CONFIG.URL ? [CONFIG.URL] : [])
];


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par "fenêtre" (ici, par 15 minutes)
  standardHeaders: true, // Retourne les informations de limite dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les anciens en-têtes `X-RateLimit-*`
  // eslint-disable-next-line no-unused-vars
  skip: (req,_res) => req.method === 'OPTIONS',
  message: { message: 'Trop de requêtes envoyées depuis cette IP, veuillez réessayer après 15 minutes.' }
});

const app = express({catchAsyncErrors: true});

app
  .use(corsMiddleware(ALLOWED_ORIGINS))
  .use(express.json())
  .use(cookieParser(CONFIG.COOKIE_SECRET))
  .use(requestLogger)
  .use('/', apiLimiter)
  .use('/', apiRoutes)
  .use(notFound)
  .use(errorHandler)
  .listen(CONFIG.PORT, () => {
    logger.info(`Serveur démarré et à l'écoute sur http://localhost:${CONFIG.PORT}`);
  });