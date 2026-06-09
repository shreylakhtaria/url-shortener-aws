'use strict';
const urlRepository = require('../repositories/UrlRepository');
const urlClickRepository = require('../repositories/UrlClickRepository');

class RedirectService {
  async processRedirect(shortCode, ipAddress, userAgent, referrer) {
    const url = await urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw { statusCode: 404, isOperational: true, message: 'URL not found' };
    }

    urlRepository.incrementClickCount(url.id).catch(console.error);
    urlClickRepository.create({
      url_id: url.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referrer
    }).catch(console.error);

    return url.original_url;
  }
}

module.exports = new RedirectService();
