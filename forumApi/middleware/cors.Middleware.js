import cors from 'cors';

export default function corsMiddleware(allowedOrigins = []) {
  return cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Accès non autorisé par la politique CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  });
}

