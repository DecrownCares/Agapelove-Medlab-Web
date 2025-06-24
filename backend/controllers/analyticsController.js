const Analytics = require('../models/Analytics');

const getAnalyticsData = async (req, res) => {
  try {
    const metrics = await Analytics.findOne();
    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found' });
    }

    res.json({
      totalPageViews: metrics.totalPageViews,
      totalSignups: metrics.totalSignups,
      totalClicksToday: metrics.totalClicksToday,
      totalVisitorsToday: metrics.totalVisitorsToday,
      trafficSources: metrics.trafficSources,
      mostViewedPost: metrics.mostViewedPost,  // This can be populated with post data
      mostClickedPost: metrics.mostClickedPost,
      signupsPerDay: metrics.signupsPerDay
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).send('Server error');
  }
};

async function logPageView(pageSlug) {
  try {
    let metrics = await Analytics.findOne();
    if (!metrics) {
      metrics = new Analytics();
    }

    // Track views per page
    metrics.pageViews[pageSlug] = (metrics.pageViews[pageSlug] || 0) + 1;

    await metrics.save();  // Save the updated metrics
  } catch (error) {
    console.error("Error logging page view:", error);
  }
}


module.exports = {
  getAnalyticsData,
  logPageView,
};
