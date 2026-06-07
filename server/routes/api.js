const express = require('express');
const router = express.Router();
const cwlController = require('../controllers/cwlController');

/**
 * POST /api/analyze
 * Analiza la Liga de Guerras de un clan
 * Body: { clanTag: "#2VCVGLJ" }
 */
router.post('/analyze', (req, res) => cwlController.analyzeCWL(req, res));

/**
 * GET /api/player/:playerTag
 * Obtiene detalles de un jugador específico
 */
router.get('/player/:playerTag', (req, res) => cwlController.getPlayerDetails(req, res));

/**
 * GET /api/health
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
