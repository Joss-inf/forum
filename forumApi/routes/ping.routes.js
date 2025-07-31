import { Router } from 'ultimate-express';

const router = Router();

/**
 * @route   GET /api/ping
 * @desc    Route de test pour vérifier si le serveur est en ligne.
 * @access  Public
 */
router.get('/', (req, res) => {
  // On répond avec un statut 200 OK et un simple message JSON.
  // Utiliser .json() est une bonne pratique pour une API.
  res.status(200).json({ message: 'pong' });
});

export default router;