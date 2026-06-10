'use strict';
const BaseController = require('./BaseController');
const urlService = require('../services/UrlService');

class UrlController extends BaseController {
  async create(req, res) {
    try {
      const { originalUrl, customAlias, tags } = req.body;
      const userId = req.user.id;
      const result = await urlService.createShortUrl(userId, originalUrl, customAlias, tags || []);
      return this.handleSuccess(res, result, 'URL shortened successfully', 201);
    } catch (error) {
      return this.handleError(error, res, 'Url.create');
    }
  }

  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const result = await urlService.getUserUrls(userId);
      return this.handleSuccess(res, result, 'URLs retrieved successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Url.getAll');
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await urlService.getUrlById(id, userId);
      return this.handleSuccess(res, result, 'URL retrieved successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Url.getById');
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await urlService.deleteUrl(id, userId);
      return this.handleSuccess(res, null, 'URL deleted successfully', 200);
    } catch (error) {
      return this.handleError(error, res, 'Url.delete');
    }
  }
}

module.exports = new UrlController();
