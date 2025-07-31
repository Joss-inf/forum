
import express from 'ultimate-express'
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js'; // <-- IMPORTER LE LOGGER
import requestLogger from './middleware/requestLogger.js'; // <-- On va créer ce middleware
import { NotFoundError } from './utils/errors.js';
import apiRoutes from './routes/index.js'
const app = express({
  catchAsyncErrors: true // Indispensable pour notre gestionnaire d'erreurs
});

const PORT = process.env.PORT || 3000;
const originsURL = process.env.URL || ''  
const allowedOrigins = [
  'http://localhost:5173',          
];

// --- OPTIONS CORS ---
const corsOptions = {
  origin: (origin, callback) => {
    // Si l'origine de la requête est dans notre liste blanche (ou si c'est une requête sans origine comme Postman), on l'autorise.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Accès non autorisé par la politique CORS'));
    }
  },
  optionsSuccessStatus: 200 // Pour les anciens navigateurs
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par "fenêtre" (ici, par 15 minutes)
  standardHeaders: true, // Retourne les informations de limite dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les anciens en-têtes `X-RateLimit-*`
  message: { message: 'Trop de requêtes envoyées depuis cette IP, veuillez réessayer après 15 minutes.' }
});

app.use(cors(corsOptions))
.use(express.json())
.use(requestLogger)
.use('/api', apiLimiter)
.use('/api', apiRoutes)
.use((req, res, next) => {
  throw new NotFoundError(`La ressource demandée n'existe pas : ${req.originalUrl}`);
})

// Gestionnaire d'erreurs GLOBAL (le plus important pour le logger)
.use((err, req, res, next) => {
  // Loguer l'erreur avec le niveau 'error'
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur interne est survenue.';
  
  res.status(statusCode).json({ message });
})
.listen(PORT, () => {
  // Remplacer console.log par logger.info
  logger.info(`Serveur démarré et à l'écoute sur le port http://localhost:${PORT}`);
});