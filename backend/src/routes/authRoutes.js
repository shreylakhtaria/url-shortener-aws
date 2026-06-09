const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, (req, res) => authController.register(req, res));
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/verify-otp', authLimiter, (req, res) => authController.verifyOtp(req, res));
router.post('/refresh', authLimiter, (req, res) => authController.refreshToken(req, res));
router.post('/logout', authLimiter, (req, res) => authController.logout(req, res));
router.post('/forgot-password', authLimiter, (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', authLimiter, (req, res) => authController.resetPassword(req, res));

module.exports = router;
