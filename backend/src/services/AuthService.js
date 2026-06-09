'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/UserRepository');
const { sendEmail, generateOtpTemplate } = require('../utils/sendEmail');

class AuthService {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw { statusCode: 400, isOperational: true, message: 'Name, email, and password are required' };
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw { statusCode: 400, isOperational: true, message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    return { userId: newUser.id };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw { statusCode: 400, isOperational: true, message: 'Email and password are required' };
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { statusCode: 404, isOperational: true, message: 'User not found' };
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw { statusCode: 401, isOperational: true, message: 'Invalid password' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await userRepository.save(user);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your 2FA Login Code',
        message: `Your login code is: ${otp}. It will expire in 10 minutes.`,
        html: generateOtpTemplate(otp),
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      throw { statusCode: 500, isOperational: true, message: 'Could not send 2FA email' };
    }

    return { email: user.email, require2FA: true };
  }

  async verifyOtp({ email, otp }) {
    if (!email || !otp) {
      throw { statusCode: 400, isOperational: true, message: 'Email and OTP are required' };
    }

    const user = await userRepository.findByEmailAndOtp(email, otp);
    if (!user) {
      throw { statusCode: 400, isOperational: true, message: 'Invalid OTP or user' };
    }

    if (new Date() > user.otpExpiresAt) {
      throw { statusCode: 400, isOperational: true, message: 'OTP has expired' };
    }

    user.otp = null;
    user.otpExpiresAt = null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_please_change',
      { expiresIn: '15m' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    user.refresh_token = refreshToken;
    await userRepository.save(user);

    return { token, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async refreshToken(tokenStr) {
    if (!tokenStr) {
      throw { statusCode: 401, isOperational: true, message: 'No refresh token provided' };
    }

    const user = await userRepository.findByRefreshToken(tokenStr);
    if (!user) {
      throw { statusCode: 403, isOperational: true, message: 'Invalid refresh token' };
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_please_change',
      { expiresIn: '15m' }
    );

    return { newAccessToken };
  }

  async logout(tokenStr) {
    if (tokenStr) {
      const user = await userRepository.findByRefreshToken(tokenStr);
      if (user) {
        user.refresh_token = null;
        await userRepository.save(user);
      }
    }
  }

  async forgotPassword({ email }) {
    if (!email) {
      throw { statusCode: 400, isOperational: true, message: 'Email is required' };
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { statusCode: 404, isOperational: true, message: 'User not found' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await userRepository.save(user);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message: `Your password reset OTP is: ${otp}\nIt will expire in 10 minutes.`,
        html: generateOtpTemplate(otp),
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      throw { statusCode: 500, isOperational: true, message: 'Could not send reset OTP email' };
    }
  }

  async resetPassword({ email, otp, newPassword }) {
    if (!email || !otp || !newPassword) {
      throw { statusCode: 400, isOperational: true, message: 'Email, OTP, and new password are required' };
    }

    const user = await userRepository.findByEmailAndOtp(email, otp);
    if (!user) {
      throw { statusCode: 400, isOperational: true, message: 'Invalid OTP or user' };
    }

    if (new Date() > user.otpExpiresAt) {
      throw { statusCode: 400, isOperational: true, message: 'OTP has expired' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await userRepository.save(user);
  }
}

module.exports = new AuthService();
