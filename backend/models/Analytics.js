const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  totalPageViews: { type: Number, default: 0 },
  totalSignups: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  totalVisitors: { type: Number, default: 0 },

  dailyStats: {
    date: { type: Date },
    pageViews: { type: Number, default: 0 },
    signups: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
  },

  weeklyStats: {
    startDate: { type: Date },
    endDate: { type: Date },
    pageViews: { type: Number, default: 0 },
    signups: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
  },

  monthlyStats: {
    month: { type: Number }, // 0 for January, 11 for December
    year: { type: Number },
    pageViews: { type: Number, default: 0 },
    signups: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
  },

  lastReset: {
    daily: { type: Date, default: new Date() },
    weekly: { type: Date, default: new Date() },
    monthly: { type: Date, default: new Date() },
  },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
