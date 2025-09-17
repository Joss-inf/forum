
import express from 'ultimate-express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js'; 
import requestLogger from './middleware/requestLogger.js'; 
import { NotFoundError } from './utils/errors.js';
import apiRoutes from './features/index.js'

// Dans votre fichier de configuration backend (app.js ou un fichier dédié)
const PORT = process.env.PORT || 3100;
const originsURL = process.env.URL || ''  

const allowedOrigins = [
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Accès non autorisé par la politique CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par "fenêtre" (ici, par 15 minutes)
  standardHeaders: true, // Retourne les informations de limite dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les anciens en-têtes `X-RateLimit-*`
  skip: (req, res) => req.method === 'OPTIONS',
  message: { message: 'Trop de requêtes envoyées depuis cette IP, veuillez réessayer après 15 minutes.' }
});

const app = express({catchAsyncErrors: true});

app
.use(cors(corsOptions))
.use(express.json())
.use(cookieParser(process.env.COOKIE_SECRET))
.use(requestLogger)
.use('/', apiLimiter)
.use('/', apiRoutes)
.use((req, res, next) => {
  throw new NotFoundError(`La ressource demandée n'existe pas : ${req.originalUrl}`);
})
.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur interne est survenue.';

  logger.error(`${statusCode} - ${message} - ${req.method} ${req.originalUrl} - ${err.stack}`);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: isProd && statusCode === 500
      ? 'Une erreur interne est survenue.'
      : message
  });
})

.listen(PORT, () => {
  // Remplacer console.log par logger.info
  logger.info(`Serveur démarré et à l'écoute sur le port http://localhost:${PORT}`);
});