'use strict';
const urlRepository = require('../repositories/UrlRepository');
const urlClickRepository = require('../repositories/UrlClickRepository');

class AnalyticsService {
  async getUrlAnalytics(urlId, userId) {
    const url = await urlRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw { statusCode: 404, isOperational: true, message: 'URL not found or unauthorized' };
    }

    const analytics = await urlClickRepository.getAnalytics(urlId);

    return {
      originalUrl: url.original_url,
      shortCode: url.short_code,
      createdAt: url.created_at,
      totalClicks: analytics.totalClicks,
      recentClicks: analytics.recentClicks
    };
  }
}

module.exports = new AnalyticsService();
