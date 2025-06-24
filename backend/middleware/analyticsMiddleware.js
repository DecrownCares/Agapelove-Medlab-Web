// const Analytics = require('../models/Analytics');

// // Middleware to log a page view
// const logPageView = async (req, res, next) => {
//   try {
//     await Analytics.findOneAndUpdate(
//       {},
//       { $inc: { totalPageViews: 1 } },
//       { upsert: true, new: true }
//     );
//     next();
//   } catch (error) {
//     console.error('Error logging page view:', error);
//     next();
//   }
// };

// // Middleware to log a signup
// const logSignup = async (req, res, next) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     await Analytics.findOneAndUpdate(
//       { "signupsPerDay.date": today },
//       { 
//         $inc: { "signupsPerDay.$[element].count": 1, totalSignups: 1 },
//       },
//       {
//         arrayFilters: [{ "element.date": today }],
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true
//       }
//     );
//     next();
//   } catch (error) {
//     console.error('Error logging signup:', error);
//     next();
//   }
// };

// // Middleware to log a click
// const logClick = async (req, res, next) => {
//   try {
//     await Analytics.findOneAndUpdate(
//       {},
//       { $inc: { totalClicksToday: 1 } },
//       { upsert: true, new: true }
//     );
//     next();
//   } catch (error) {
//     console.error('Error logging click:', error);
//     next();
//   }
// };

// // Middleware to log a visitor
// const logVisitor = async (req, res, next) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     await Analytics.findOneAndUpdate(
//       {},
//       { $inc: { totalVisitorsToday: 1 } },
//       { upsert: true, new: true }
//     );
//     next();
//   } catch (error) {
//     console.error('Error logging visitor:', error);
//     next();
//   }
// };

// module.exports = {
//   logPageView,
//   logSignup,
//   logClick,
//   logVisitor,
// };


const Analytics = require('../models/Analytics');

const isSameDay = (date1, date2) =>
  new Date(date1).toDateString() === new Date(date2).toDateString();

const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const getWeekStart = (date) => {
    const day = date.getDay();
    return new Date(date.setDate(date.getDate() - day));
  };

  return getWeekStart(d1).toDateString() === getWeekStart(d2).toDateString();
};

const isSameMonth = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};


const resetStats = async (analytics) => {
  const now = new Date();

  // Reset daily stats if it's a new day
  if (!isSameDay(analytics.lastReset.daily, now)) {
    analytics.dailyStats = {
      date: now,
      pageViews: 0,
      signups: 0,
      clicks: 0,
      visitors: 0,
    };
    analytics.lastReset.daily = now;
  }

  // Reset weekly stats if it's a new week
  if (!isSameWeek(analytics.lastReset.weekly, now)) {
    analytics.weeklyStats = {
      startDate: now,
      endDate: new Date(now.setDate(now.getDate() + 6)), // Set end of week
      pageViews: 0,
      signups: 0,
      clicks: 0,
      visitors: 0,
    };
    analytics.lastReset.weekly = now;
  }

  // Reset monthly stats if it's a new month
  if (!isSameMonth(analytics.lastReset.monthly, now)) {
    analytics.monthlyStats = {
      month: now.getMonth(),
      year: now.getFullYear(),
      pageViews: 0,
      signups: 0,
      clicks: 0,
      visitors: 0,
    };
    analytics.lastReset.monthly = now;
  }

  // Save updates
  await analytics.save();
};



const logActivity = async (req, res, next) => {
  try {
    // Fetch or create analytics document
    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = await Analytics.create({});
    }

    // Reset daily, weekly, and monthly stats as needed
    await resetStats(analytics);

    // Log the activity based on type
    const activityType = req.activityType; // Provided by `activityLogger`
    if (activityType) {
      const { dailyStats, weeklyStats, monthlyStats } = analytics;

      // Increment global and specific stats
      analytics.totalPageViews += activityType === 'pageView' ? 1 : 0;
      analytics.totalSignups += activityType === 'signup' ? 1 : 0;
      analytics.totalClicks += activityType === 'click' ? 1 : 0;
      analytics.totalVisitors += activityType === 'visitor' ? 1 : 0;

      dailyStats.pageViews += activityType === 'pageView' ? 1 : 0;
      dailyStats.signups += activityType === 'signup' ? 1 : 0;
      dailyStats.clicks += activityType === 'click' ? 1 : 0;
      dailyStats.visitors += activityType === 'visitor' ? 1 : 0;

      weeklyStats.pageViews += activityType === 'pageView' ? 1 : 0;
      weeklyStats.signups += activityType === 'signup' ? 1 : 0;
      weeklyStats.clicks += activityType === 'click' ? 1 : 0;
      weeklyStats.visitors += activityType === 'visitor' ? 1 : 0;

      monthlyStats.pageViews += activityType === 'pageView' ? 1 : 0;
      monthlyStats.signups += activityType === 'signup' ? 1 : 0;
      monthlyStats.clicks += activityType === 'click' ? 1 : 0;
      monthlyStats.visitors += activityType === 'visitor' ? 1 : 0;

      await analytics.save();
    }

    next();
  } catch (error) {
    console.error('Error logging activity:', error);
    next();
  }
};

const activityLogger = (type) => (req, res, next) => {
  req.activityType = type; // e.g., 'pageView', 'signup'
  next();
};


const getAnalyticsData = async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    if (!analytics) {
      return res.status(404).json({ message: 'No analytics data found.' });
    }

    res.json({
      totalPageViews: analytics.totalPageViews,
      totalSignups: analytics.totalSignups,
      totalClicks: analytics.totalClicks,
      totalVisitors: analytics.totalVisitors,
      dailyStats: analytics.dailyStats,
      weeklyStats: analytics.weeklyStats,
      monthlyStats: analytics.monthlyStats,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).send('Server error');
  }
};


module.exports = {
  logActivity,
  activityLogger,
  getAnalyticsData
};


