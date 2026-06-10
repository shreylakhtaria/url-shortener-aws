'use strict';
const { nanoid } = require('nanoid');
const urlRepository = require('../repositories/UrlRepository');

class UrlService {
  async createShortUrl(userId, originalUrl, customAlias = null, tags = []) {
    if (!originalUrl) {
      throw { statusCode: 400, isOperational: true, message: 'Original URL is required' };
    }
    
    try {
      new URL(originalUrl);
    } catch (e) {
      throw { statusCode: 400, isOperational: true, message: 'Invalid URL format' };
    }

    let shortCode = customAlias;
    if (shortCode) {
      const existing = await urlRepository.findByShortCode(shortCode);
      if (existing) {
        throw { statusCode: 400, isOperational: true, message: 'Custom alias is already in use' };
      }
    } else {
      let isUnique = false;
      while (!isUnique) {
        shortCode = nanoid(7);
        const existing = await urlRepository.findByShortCode(shortCode);
        if (!existing) isUnique = true;
      }
    }

    return await urlRepository.create({
      user_id: userId,
      original_url: originalUrl,
      short_code: shortCode,
      tags: tags
    });
  }

  async getUserUrls(userId) {
    return await urlRepository.findAllByUserId(userId);
  }

  async getUrlById(id, userId) {
    const url = await urlRepository.findByIdAndUserId(id, userId);
    if (!url) {
      throw { statusCode: 404, isOperational: true, message: 'URL not found or unauthorized' };
    }
    return url;
  }

  async deleteUrl(id, userId) {
    const url = await urlRepository.findByIdAndUserId(id, userId);
    if (!url) {
      throw { statusCode: 404, isOperational: true, message: 'URL not found or unauthorized' };
    }
    await urlRepository.delete(id);
  }
}

module.exports = new UrlService();
