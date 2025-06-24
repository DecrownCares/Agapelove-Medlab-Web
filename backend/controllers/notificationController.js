const Notification = require('../models/Notification');

const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  try {
    const notification = new Notification({ userId, type, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
};
