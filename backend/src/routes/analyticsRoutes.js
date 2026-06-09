const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/AnalyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(authenticateToken);
router.use(generalLimiter);

router.get('/:urlId', (req, res) => analyticsController.getAnalytics(req, res));

module.exports = router;
