const express = require('express');
const router = express.Router();
const redirectController = require('../controllers/RedirectController');
const { generalLimiter } = require('../middleware/rateLimiter');

router.get('/:shortCode', generalLimiter, (req, res) => redirectController.redirect(req, res));

module.exports = router;
