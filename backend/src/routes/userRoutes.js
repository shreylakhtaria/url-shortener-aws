'use strict';
const express = require('express');
const userController = require('../controllers/UserController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.put('/profile', userController.updateProfile.bind(userController));
router.put('/password', userController.updatePassword.bind(userController));
router.delete('/account', userController.deleteAccount.bind(userController));

module.exports = router;
