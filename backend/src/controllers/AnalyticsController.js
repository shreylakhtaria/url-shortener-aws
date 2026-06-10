const BaseController = require('./BaseController');
const analyticsService = require('../services/AnalyticsService');

class AnalyticsController extends BaseController {
  async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      const data = await analyticsService.getAccountAnalytics(userId);
      return this.handleSuccess(res, data, 'Analytics fetched successfully');
    } catch (error) {
      return this.handleError(error, res, 'Analytics.getDashboardStats');
    }
  }
  async getUrlStats(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const data = await analyticsService.getUrlAnalytics(id, userId);
      return this.handleSuccess(res, data, 'URL analytics fetched successfully');
    } catch (error) {
      return this.handleError(error, res, 'Analytics.getUrlStats');
    }
  }
}

module.exports = new AnalyticsController();
