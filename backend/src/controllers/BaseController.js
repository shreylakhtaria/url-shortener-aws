'use strict';

class BaseController {
  handleSuccess(res, data = null, message = 'Success', statusCode = 200) {
    const response = { success: true, message };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
  }

  handleError(error, res, action = 'Action') {
    console.error(`[${action}] Error:`, error);
    // Integrate Sentry here in production
    const statusCode = error.statusCode || 500;
    const message = error.isOperational ? error.message : 'Internal Server Error';
    return res.status(statusCode).json({ success: false, error: message });
  }
}

module.exports = BaseController;
