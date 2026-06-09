'use strict';
const BaseController = require('./BaseController');
const authService = require('../services/AuthService');

class AuthController extends BaseController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return this.handleSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      return this.handleError(error, res, 'Auth.register');
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      return this.handleSuccess(res, result, 'OTP sent to email', 200);
    } catch (error) {
      return this.handleError(error, res, 'Auth.login');
    }
  }

  async verifyOtp(req, res) {
    try {
      const result = await authService.verifyOtp(req.body);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return this.handleSuccess(res, {
        auth: true,
        token: result.token,
        user: result.user
      }, 'Verified successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Auth.verifyOtp');
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const result = await authService.refreshToken(refreshToken);
      return this.handleSuccess(res, { auth: true, token: result.newAccessToken }, 'Token refreshed', 200);
    } catch (error) {
      return this.handleError(error, res, 'Auth.refreshToken');
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await authService.logout(refreshToken);
      
      res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0)
      });

      return this.handleSuccess(res, null, 'Logged out successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Auth.logout');
    }
  }

  async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body);
      return this.handleSuccess(res, null, 'Password reset OTP sent to email', 200);
    } catch (error) {
      return this.handleError(error, res, 'Auth.forgotPassword');
    }
  }

  async resetPassword(req, res) {
    try {
      await authService.resetPassword(req.body);
      return this.handleSuccess(res, null, 'Password reset successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Auth.resetPassword');
    }
  }
}

module.exports = new AuthController();
