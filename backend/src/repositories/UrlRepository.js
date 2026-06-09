'use strict';
const { Url } = require('../models');

class UrlRepository {
  async create(data) {
    return await Url.create(data);
  }

  async findAllByUserId(userId) {
    return await Url.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
  }

  async findByIdAndUserId(id, userId) {
    return await Url.findOne({ where: { id, user_id: userId } });
  }

  async findByShortCode(shortCode) {
    return await Url.findOne({ where: { short_code: shortCode } });
  }

  async delete(id) {
    return await Url.destroy({ where: { id } });
  }
  
  async incrementClickCount(id) {
    return await Url.increment('click_count', { by: 1, where: { id } });
  }
}

module.exports = new UrlRepository();
