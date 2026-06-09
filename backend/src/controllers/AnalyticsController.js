'use strict';
const BaseController = require('./BaseController');
const analyticsService = require('../services/AnalyticsService');

class AnalyticsController extends BaseController {
  async getAnalytics(req, res) {
    try {
      const { urlId } = req.params;
      const userId = req.user.id;
      const result = await analyticsService.getUrlAnalytics(urlId, userId);
      return this.handleSuccess(res, result, 'Analytics retrieved successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Analytics.getAnalytics');
    }
  }
}

module.exports = new AnalyticsController();
