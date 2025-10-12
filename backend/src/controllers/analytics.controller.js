const analyticsService = require('../services/analytics.service');

class AnalyticsController {
  // Get analytics summary for a specific URL
  async getUrlAnalytics(req, res) {
    try {
      const { urlId } = req.params;
      const { startDate, endDate } = req.query;
      const userId = req.user._id || req.user.id;

      console.log('🔍 Analytics request - urlId:', urlId, 'userId:', userId);
      console.log('🔍 Analytics request - urlId length:', urlId.length);
      console.log('🔍 Analytics request - urlId type:', typeof urlId);

      // Check if URL exists in database
      const Url = require('../models/Url');
      const urlDoc = await Url.findById(urlId);
      console.log('🔍 URL found in database:', urlDoc ? 'YES' : 'NO');
      if (urlDoc) {
        console.log('🔍 URL shortCode:', urlDoc.shortCode);
        console.log('🔍 URL userId:', urlDoc.userId);
      }

      // For now, return mock data to test the frontend
      const mockSummary = {
        totalClicks: 17,
        uniqueCountries: 3,
        uniqueDevices: 2,
        uniqueBrowsers: 2,
        uniqueReferrers: 1,
        topCountries: [
          { country: 'United States', count: 12 },
          { country: 'Canada', count: 3 },
          { country: 'United Kingdom', count: 2 }
        ],
        topDevices: [
          { device: 'desktop', count: 10 },
          { device: 'mobile', count: 7 }
        ],
        clicksByHour: [],
        clicksByDay: []
      };

      console.log('🔍 Sending response:', { success: true, data: mockSummary });
      res.json({
        success: true,
        data: mockSummary
      });

      // TODO: Uncomment this when the real analytics is working
      // const summary = await analyticsService.getAnalyticsSummary(
      //   urlId, 
      //   userId, 
      //   startDate, 
      //   endDate
      // );

      // res.json({
      //   success: true,
      //   data: summary
      // });
    } catch (error) {
      console.error('❌ Get URL analytics error:', error);
      console.error('❌ Error details:', error.message, error.stack);
      res.status(500).json({
        error: 'Failed to fetch analytics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get time series data for a URL
  async getTimeSeries(req, res) {
    try {
      const { urlId } = req.params;
      const { period = 'day', startDate, endDate } = req.query;
      const userId = req.user._id || req.user.id;

      // Mock time series data for testing
      const mockTimeSeries = [
        { date: { year: 2025, month: 10, day: 10 }, clicks: 5, uniqueVisitors: 4 },
        { date: { year: 2025, month: 10, day: 11 }, clicks: 8, uniqueVisitors: 6 },
        { date: { year: 2025, month: 10, day: 12 }, clicks: 4, uniqueVisitors: 3 }
      ];

      res.json({
        success: true,
        data: mockTimeSeries
      });

      // TODO: Uncomment this when real analytics is working
      // const timeSeries = await analyticsService.getTimeSeries(
      //   urlId,
      //   userId,
      //   period,
      //   startDate,
      //   endDate
      // );

      // res.json({
      //   success: true,
      //   data: timeSeries
      // });
    } catch (error) {
      console.error('Get time series error:', error);
      res.status(500).json({
        error: 'Failed to fetch time series data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get detailed click logs for a URL
  async getClickLogs(req, res) {
    try {
      const { urlId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user._id || req.user.id;

      // Mock click logs data for testing
      const mockClicks = [
        {
          _id: 'mock1',
          timestamp: new Date().toISOString(),
          clickData: {
            ip: '192.168.1.1',
            country: 'United States',
            city: 'San Francisco',
            device: 'desktop',
            browser: 'Chrome',
            os: 'Windows',
            referrer: 'https://google.com',
            language: 'en-US'
          }
        },
        {
          _id: 'mock2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          clickData: {
            ip: '192.168.1.2',
            country: 'Canada',
            city: 'Toronto',
            device: 'mobile',
            browser: 'Safari',
            os: 'iOS',
            referrer: 'Direct',
            language: 'en-CA'
          }
        }
      ];

      res.json({
        success: true,
        data: mockClicks,
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          pages: 1
        }
      });

      // TODO: Uncomment this when real analytics is working
      // const result = await analyticsService.getClickLogs(
      //   urlId,
      //   userId,
      //   parseInt(page),
      //   parseInt(limit)
      // );

      // res.json({
      //   success: true,
      //   data: result.clicks,
      //   pagination: result.pagination
      // });
    } catch (error) {
      console.error('Get click logs error:', error);
      res.status(500).json({
        error: 'Failed to fetch click logs',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Export analytics data
  async exportAnalytics(req, res) {
    try {
      const { urlId } = req.params;
      const { format = 'csv', startDate, endDate } = req.query;
      const userId = req.user._id || req.user.id;

      const data = await analyticsService.exportAnalytics(
        urlId,
        userId,
        format,
        startDate,
        endDate
      );

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="analytics-${urlId}.csv"`);
        return res.send(data);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="analytics-${urlId}.json"`);
        return res.send(data);
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Export analytics error:', error);
      res.status(500).json({
        error: 'Failed to export analytics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get user's analytics overview (all URLs)
  async getUserAnalyticsOverview(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user._id || req.user.id;

      const overview = await analyticsService.getUserAnalyticsOverview(
        userId,
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('Get user analytics overview error:', error);
      res.status(500).json({
        error: 'Failed to fetch analytics overview',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get real-time analytics (last 24 hours)
  async getRealTimeAnalytics(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const overview = await analyticsService.getUserAnalyticsOverview(
        userId,
        last24Hours,
        new Date()
      );

      // Add real-time metrics
      const realTimeData = {
        ...overview,
        last24Hours: overview.totalClicks,
        lastHour: 0, // This would require additional query for last hour
        activeUrls: overview.urls.filter(url => url.lastClick > last24Hours).length
      };

      res.json({
        success: true,
        data: realTimeData
      });
    } catch (error) {
      console.error('Get real-time analytics error:', error);
      res.status(500).json({
        error: 'Failed to fetch real-time analytics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AnalyticsController();
