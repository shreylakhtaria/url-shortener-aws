'use strict';
const { User } = require('../models');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findByRefreshToken(token) {
    return await User.findOne({ where: { refresh_token: token } });
  }

  async findByEmailAndOtp(email, otp) {
    return await User.findOne({ where: { email, otp } });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async save(user) {
    return await user.save();
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();
