'use strict';
const BaseController = require('./BaseController');
const redirectService = require('../services/RedirectService');

class RedirectController extends BaseController {
  async redirect(req, res) {
    try {
      const { shortCode } = req.params;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const referrer = req.headers['referer'] || req.headers['referrer'];

      const originalUrl = await redirectService.processRedirect(shortCode, ipAddress, userAgent, referrer);
      return res.redirect(302, originalUrl);
    } catch (error) {
      return this.handleError(error, res, 'Redirect.redirect');
    }
  }
}

module.exports = new RedirectController();
