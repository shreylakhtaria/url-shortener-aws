const express = require('express');
const router = express.Router();
const urlController = require('../controllers/UrlController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(authenticateToken);
router.use(generalLimiter);

router.post('/', (req, res) => urlController.create(req, res));
router.get('/', (req, res) => urlController.getAll(req, res));
router.get('/:id', (req, res) => urlController.getById(req, res));
router.delete('/:id', (req, res) => urlController.delete(req, res));

module.exports = router;
