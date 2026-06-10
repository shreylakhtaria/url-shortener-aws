'use strict';

const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/UserRepository');
const urlRepository = require('../repositories/UrlRepository');

class UserService {
  async updateProfile(userId, { name, email }) {
    if (!name || !email) {
      throw { statusCode: 400, isOperational: true, message: 'Name and email are required' };
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, isOperational: true, message: 'User not found' };
    }

    // Check if new email is already taken
    if (user.email !== email) {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw { statusCode: 400, isOperational: true, message: 'Email already exists' };
      }
    }

    user.name = name;
    user.email = email;
    await userRepository.save(user);

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw { statusCode: 400, isOperational: true, message: 'Current and new passwords are required' };
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, isOperational: true, message: 'User not found' };
    }

    const passwordIsValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordIsValid) {
      throw { statusCode: 401, isOperational: true, message: 'Invalid current password' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await userRepository.save(user);

    return { success: true };
  }

  async deleteAccount(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, isOperational: true, message: 'User not found' };
    }

    // First, find all URLs owned by the user
    const urls = await urlRepository.findAllByUserId(userId);
    
    // Delete all URLs (this should cascade delete clicks if DB is set up, or we just delete URLs)
    for (const url of urls) {
      await urlRepository.delete(url.id);
    }

    // Delete user
    await userRepository.delete(userId);

    return { success: true };
  }
}

module.exports = new UserService();
