const Analytics = require('../models/Analytics');
const Url = require('../models/Url');

class AnalyticsService {
  // Track a click with detailed analytics
  async trackClick(shortCode, req) {
    try {
      const url = await Url.findOne({ shortCode });
      if (!url) {
        throw new Error('URL not found');
      }

      // Extract analytics data from request
      const clickData = this.extractClickData(req);
      
      // Create analytics record
      const analytics = new Analytics({
        urlId: url._id,
        shortCode,
        clickData
      });

      await analytics.save();

      // Update URL click count
      await Url.findByIdAndUpdate(url._id, {
        $inc: { 'clicks.count': 1 },
        $set: { 'clicks.lastClickedAt': new Date() }
      });

      return analytics;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      throw error;
    }
  }

  // Extract click data from request
  extractClickData(req) {
    const ip = this.getClientIP(req);
    const userAgent = req.get('User-Agent') || '';
    const referrer = req.get('Referer') || req.get('Referrer') || '';

    return {
      ip,
      userAgent,
      referrer,
      device: this.detectDevice(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
      language: req.get('Accept-Language') || '',
      timezone: req.get('X-Timezone') || '',
      // Note: Country, city, region, ISP would require IP geolocation service
      // For now, we'll set these as null and can integrate a service later
      country: null,
      city: null,
      region: null,
      isp: null
    };
  }

  // Get client IP address
  getClientIP(req) {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           '127.0.0.1';
  }

  // Detect device type from user agent
  detectDevice(userAgent) {
    const ua = userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      return 'mobile';
    } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet';
    } else if (/desktop|windows|macintosh|linux/i.test(ua)) {
      return 'desktop';
    }
    
    return 'unknown';
  }

  // Detect browser from user agent
  detectBrowser(userAgent) {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
    if (ua.includes('msie') || ua.includes('trident')) return 'Internet Explorer';
    
    return 'Unknown';
  }

  // Detect operating system from user agent
  detectOS(userAgent) {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('macintosh') || ua.includes('mac os')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    
    return 'Unknown';
  }

  // Get analytics summary for a URL
  async getAnalyticsSummary(urlId, userId, startDate = null, endDate = null) {
    try {
      // Verify user owns this URL
      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        throw new Error('URL not found or access denied');
      }

      const summary = await Analytics.getAnalyticsSummary(urlId, startDate, endDate);
      return summary[0] || {
        totalClicks: 0,
        uniqueCountries: 0,
        uniqueDevices: 0,
        uniqueBrowsers: 0,
        uniqueReferrers: 0,
        topCountries: [],
        topDevices: [],
        clicksByHour: [],
        clicksByDay: []
      };
    } catch (error) {
      console.error('Get analytics summary error:', error);
      throw error;
    }
  }

  // Get time series data
  async getTimeSeries(urlId, userId, period = 'day', startDate = null, endDate = null) {
    try {
      // Verify user owns this URL
      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        throw new Error('URL not found or access denied');
      }

      const timeSeries = await Analytics.getTimeSeries(urlId, period, startDate, endDate);
      return timeSeries;
    } catch (error) {
      console.error('Get time series error:', error);
      throw error;
    }
  }

  // Get detailed click logs
  async getClickLogs(urlId, userId, page = 1, limit = 50) {
    try {
      // Verify user owns this URL
      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        throw new Error('URL not found or access denied');
      }

      const skip = (page - 1) * limit;
      
      const clicks = await Analytics.find({ urlId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .select('clickData timestamp');

      const total = await Analytics.countDocuments({ urlId });

      return {
        clicks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get click logs error:', error);
      throw error;
    }
  }

  // Export analytics data as CSV
  async exportAnalytics(urlId, userId, format = 'csv', startDate = null, endDate = null) {
    try {
      // Verify user owns this URL
      const url = await Url.findOne({ _id: urlId, userId });
      if (!url) {
        throw new Error('URL not found or access denied');
      }

      const matchStage = { urlId };
      if (startDate && endDate) {
        matchStage.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const clicks = await Analytics.find(matchStage)
        .sort({ timestamp: -1 })
        .select('clickData timestamp');

      if (format === 'csv') {
        return this.formatAsCSV(clicks);
      } else if (format === 'json') {
        return JSON.stringify(clicks, null, 2);
      }

      return clicks;
    } catch (error) {
      console.error('Export analytics error:', error);
      throw error;
    }
  }

  // Format analytics data as CSV
  formatAsCSV(clicks) {
    const headers = [
      'Timestamp',
      'IP Address',
      'Country',
      'City',
      'Device',
      'Browser',
      'OS',
      'Referrer',
      'Language'
    ];

    const rows = clicks.map(click => [
      click.timestamp.toISOString(),
      click.clickData.ip || '',
      click.clickData.country || '',
      click.clickData.city || '',
      click.clickData.device || '',
      click.clickData.browser || '',
      click.clickData.os || '',
      click.clickData.referrer || '',
      click.clickData.language || ''
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  }

  // Get user's analytics overview (all URLs)
  async getUserAnalyticsOverview(userId, startDate = null, endDate = null) {
    try {
      const userUrls = await Url.find({ userId }).select('_id shortCode originalUrl');
      const urlIds = userUrls.map(url => url._id);

      const matchStage = { urlId: { $in: urlIds } };
      if (startDate && endDate) {
        matchStage.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: '$urlId',
            totalClicks: { $sum: 1 },
            uniqueDevices: { $addToSet: '$clickData.device' },
            uniqueBrowsers: { $addToSet: '$clickData.browser' },
            lastClick: { $max: '$timestamp' }
          }
        },
        {
          $lookup: {
            from: 'urls',
            localField: '_id',
            foreignField: '_id',
            as: 'urlInfo'
          }
        },
        {
          $project: {
            urlId: '$_id',
            shortCode: { $arrayElemAt: ['$urlInfo.shortCode', 0] },
            originalUrl: { $arrayElemAt: ['$urlInfo.originalUrl', 0] },
            totalClicks: 1,
            uniqueDevices: { $size: '$uniqueDevices' },
            uniqueBrowsers: { $size: '$uniqueBrowsers' },
            lastClick: 1
          }
        },
        { $sort: { totalClicks: -1 } }
      ];

      const overview = await Analytics.aggregate(pipeline);
      
      return {
        totalUrls: userUrls.length,
        totalClicks: overview.reduce((sum, item) => sum + item.totalClicks, 0),
        urls: overview
      };
    } catch (error) {
      console.error('Get user analytics overview error:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
