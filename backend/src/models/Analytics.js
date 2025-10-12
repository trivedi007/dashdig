const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true
  },
  shortCode: {
    type: String,
    required: true,
    index: true
  },
  clickData: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String,
    region: String,
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    },
    browser: String,
    os: String,
    isp: String,
    timezone: String,
    language: String
  },
  metadata: {
    sessionId: String,
    campaignId: String,
    source: String,
    medium: String,
    customParams: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for performance
analyticsSchema.index({ urlId: 1, timestamp: -1 });
analyticsSchema.index({ shortCode: 1, timestamp: -1 });
analyticsSchema.index({ 'clickData.country': 1 });
analyticsSchema.index({ 'clickData.device': 1 });
analyticsSchema.index({ 'clickData.browser': 1 });
analyticsSchema.index({ timestamp: -1 });

// Static method to get analytics summary
analyticsSchema.statics.getAnalyticsSummary = async function(urlId, startDate, endDate) {
  const matchStage = { urlId: new mongoose.Types.ObjectId(urlId) };
  
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
        _id: null,
        totalClicks: { $sum: 1 },
        uniqueCountries: { $addToSet: '$clickData.country' },
        uniqueDevices: { $addToSet: '$clickData.device' },
        uniqueBrowsers: { $addToSet: '$clickData.browser' },
        uniqueReferrers: { $addToSet: '$clickData.referrer' },
        clicksByCountry: {
          $push: {
            country: '$clickData.country',
            timestamp: '$timestamp'
          }
        },
        clicksByDevice: {
          $push: {
            device: '$clickData.device',
            timestamp: '$timestamp'
          }
        },
        clicksByHour: {
          $push: {
            hour: { $hour: '$timestamp' },
            timestamp: '$timestamp'
          }
        },
        clicksByDay: {
          $push: {
            day: { $dayOfMonth: '$timestamp' },
            month: { $month: '$timestamp' },
            year: { $year: '$timestamp' },
            timestamp: '$timestamp'
          }
        }
      }
    },
    {
      $project: {
        totalClicks: 1,
        uniqueCountries: { $size: '$uniqueCountries' },
        uniqueDevices: { $size: '$uniqueDevices' },
        uniqueBrowsers: { $size: '$uniqueBrowsers' },
        uniqueReferrers: { $size: '$uniqueReferrers' },
        topCountries: {
          $slice: [
            {
              $map: {
                input: { $setUnion: '$clicksByCountry.country' },
                as: 'country',
                in: {
                  country: '$$country',
                  count: {
                    $size: {
                      $filter: {
                        input: '$clicksByCountry',
                        cond: { $eq: ['$$this.country', '$$country'] }
                      }
                    }
                  }
                }
              }
            },
            10
          ]
        },
        topDevices: {
          $slice: [
            {
              $map: {
                input: { $setUnion: '$clicksByDevice.device' },
                as: 'device',
                in: {
                  device: '$$device',
                  count: {
                    $size: {
                      $filter: {
                        input: '$clicksByDevice',
                        cond: { $eq: ['$$this.device', '$$device'] }
                      }
                    }
                  }
                }
              }
            },
            5
          ]
        },
        clicksByHour: 1,
        clicksByDay: 1
      }
    }
  ];

  return this.aggregate(pipeline);
};

// Static method to get time series data
analyticsSchema.statics.getTimeSeries = async function(urlId, period = 'day', startDate, endDate) {
  const matchStage = { urlId: new mongoose.Types.ObjectId(urlId) };
  
  if (startDate && endDate) {
    matchStage.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  let groupFormat;
  switch (period) {
    case 'hour':
      groupFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' },
        hour: { $hour: '$timestamp' }
      };
      break;
    case 'day':
      groupFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' }
      };
      break;
    case 'week':
      groupFormat = {
        year: { $year: '$timestamp' },
        week: { $week: '$timestamp' }
      };
      break;
    case 'month':
      groupFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' }
      };
      break;
    default:
      groupFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' }
      };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: groupFormat,
        clicks: { $sum: 1 },
        uniqueVisitors: { $addToSet: '$clickData.ip' }
      }
    },
    {
      $project: {
        date: '$_id',
        clicks: 1,
        uniqueVisitors: { $size: '$uniqueVisitors' }
      }
    },
    { $sort: { date: 1 } }
  ];

  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Analytics', analyticsSchema);
