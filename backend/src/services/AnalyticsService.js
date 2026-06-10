const { Url, UrlClick } = require('../models');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const { Op } = require('sequelize');

class AnalyticsService {
  async getAccountAnalytics(userId) {
    // 1. Get all URLs for the user
    const urls = await Url.findAll({
      where: { user_id: userId }
    });

    const urlIds = urls.map(u => u.id);
    const totalLinks = urls.length;
    const totalClicks = urls.reduce((sum, u) => sum + (u.click_count || 0), 0);
    const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;

    // 2. Fetch all clicks for these URLs within the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clicks = await UrlClick.findAll({
      where: {
        url_id: { [Op.in]: urlIds },
        clicked_at: { [Op.gte]: thirtyDaysAgo }
      },
      order: [['clicked_at', 'ASC']]
    });

    // 3. Process Clicks over time
    const clicksByDate = {};
    const topDevicesMap = {};
    const topBrowsersMap = {};
    const topLocationsMap = {};

    clicks.forEach(click => {
      // Group by date (YYYY-MM-DD)
      const dateKey = click.clicked_at.toISOString().split('T')[0];
      clicksByDate[dateKey] = (clicksByDate[dateKey] || 0) + 1;

      // Parse User-Agent
      if (click.user_agent) {
        const parser = new UAParser(click.user_agent);
        const browser = parser.getBrowser().name || 'Unknown';
        const deviceType = parser.getDevice().type || 'Desktop';
        
        topBrowsersMap[browser] = (topBrowsersMap[browser] || 0) + 1;
        topDevicesMap[deviceType] = (topDevicesMap[deviceType] || 0) + 1;
      } else {
        topBrowsersMap['Unknown'] = (topBrowsersMap['Unknown'] || 0) + 1;
        topDevicesMap['Unknown'] = (topDevicesMap['Unknown'] || 0) + 1;
      }

      // Parse IP Location
      if (click.ip_address) {
        // Strip out IPv6 localhost "::1" or IPv4 localhost "127.0.0.1"
        const isLocal = click.ip_address === '::1' || click.ip_address === '127.0.0.1' || click.ip_address.startsWith('192.168.');
        if (isLocal) {
          topLocationsMap['Local/Testing'] = (topLocationsMap['Local/Testing'] || 0) + 1;
        } else {
          const geo = geoip.lookup(click.ip_address);
          if (geo && geo.country) {
            const loc = `${geo.city || 'Unknown City'}, ${geo.country}`;
            topLocationsMap[loc] = (topLocationsMap[loc] || 0) + 1;
          } else {
            topLocationsMap['Unknown'] = (topLocationsMap['Unknown'] || 0) + 1;
          }
        }
      } else {
        topLocationsMap['Unknown'] = (topLocationsMap['Unknown'] || 0) + 1;
      }
    });

    // Format Maps into sorted Arrays
    const formatTopMap = (map) => Object.keys(map).map(name => ({ name, value: map[name] })).sort((a, b) => b.value - a.value).slice(0, 5);

    const clicksOverTime = Object.keys(clicksByDate).map(date => ({
      date,
      clicks: clicksByDate[date]
    }));

    return {
      summary: {
        totalLinks,
        totalClicks,
        avgClicks
      },
      clicksOverTime,
      topDevices: formatTopMap(topDevicesMap),
      topBrowsers: formatTopMap(topBrowsersMap),
      topLocations: formatTopMap(topLocationsMap)
    };
  }
  async getUrlAnalytics(id, userId) {
    const url = await Url.findOne({
      where: { id, user_id: userId }
    });
    
    if (!url) {
      throw { statusCode: 404, isOperational: true, message: 'URL not found or unauthorized' };
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentClicks = await UrlClick.count({
      where: {
        url_id: id,
        clicked_at: { [Op.gte]: thirtyDaysAgo }
      }
    });

    return {
      id: url.id,
      shortCode: url.short_code,
      originalUrl: url.original_url,
      totalClicks: url.click_count || 0,
      recentClicks: recentClicks
    };
  }
}

module.exports = new AnalyticsService();
