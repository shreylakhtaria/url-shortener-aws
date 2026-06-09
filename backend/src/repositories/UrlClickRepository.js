'use strict';
const { UrlClick } = require('../models');
const { Op } = require('sequelize');

class UrlClickRepository {
  async create(data) {
    return await UrlClick.create(data);
  }

  async getAnalytics(urlId) {
    const totalClicks = await UrlClick.count({ where: { url_id: urlId } });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentClicks = await UrlClick.count({
      where: {
        url_id: urlId,
        clicked_at: { [Op.gte]: sevenDaysAgo }
      }
    });
    
    return { totalClicks, recentClicks };
  }
}

module.exports = new UrlClickRepository();
