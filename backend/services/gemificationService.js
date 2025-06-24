const UserActivity = require('../models/UserActivity');
const User = require('../models/User');

const pointValues = {
  comment: 10,
  quiz: 20,
  poll: 5,
  post: 15,
};

const badges = {
  rookie: 100,
  intermediate: 500,
  expert: 1000,
};

const addActivity = async (userId, activityType) => {
  const points = pointValues[activityType] || 0;

  const activity = new UserActivity({ userId, activityType, points });
  await activity.save();

  const user = await User.findById(userId);
  user.points += points;

  // Award badges
  for (const [badge, threshold] of Object.entries(badges)) {
    if (user.points >= threshold && !user.badges.includes(badge)) {
      user.badges.push(badge);
    }
  }

  await user.save();
};

const getUserStats = async (userId) => {
  const user = await User.findById(userId);
  return {
    points: user.points,
    badges: user.badges,
  };
};

module.exports = {
  addActivity,
  getUserStats,
};
