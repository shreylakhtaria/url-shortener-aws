'use strict';
const express = require('express');
const analyticsController = require('../controllers/AnalyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', analyticsController.getDashboardStats.bind(analyticsController));
router.get('/:id', analyticsController.getUrlStats.bind(analyticsController));

module.exports = router;
