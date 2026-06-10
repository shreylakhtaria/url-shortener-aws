const BaseController = require('./BaseController');
const analyticsService = require('../services/AnalyticsService');

class AnalyticsController extends BaseController {
  async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      const data = await analyticsService.getAccountAnalytics(userId);
      return this.handleSuccess(res, data, 'Analytics fetched successfully');
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch analytics');
    }
  }
}

module.exports = new AnalyticsController();
