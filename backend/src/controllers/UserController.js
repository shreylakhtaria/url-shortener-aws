'use strict';
const BaseController = require('./BaseController');
const userService = require('../services/UserService');

class UserController extends BaseController {
  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;
      const result = await userService.updateProfile(userId, { name, email });
      return this.handleSuccess(res, result, 'Profile updated successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'User.updateProfile');
    }
  }

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      const result = await userService.updatePassword(userId, { currentPassword, newPassword });
      return this.handleSuccess(res, result, 'Password updated successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'User.updatePassword');
    }
  }

  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      await userService.deleteAccount(userId);
      return this.handleSuccess(res, null, 'Account deleted successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'User.deleteAccount');
    }
  }
}

module.exports = new UserController();
