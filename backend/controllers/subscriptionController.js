const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');

const createSubscriptionPlan = async (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, price, duration, features } = req.body;

  try {
    const plan = new SubscriptionPlan({ name, price, duration, features });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription plan', error });
  }
};

const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription plans', error });
  }
};

const subscribeUserToPlan = async (req, res) => {
  const { planId, paymentDetails } = req.body;

  try {
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const userSubscription = new UserSubscription({
      userId: req.user._id,
      planId,
      startDate,
      endDate,
      paymentDetails,
    });

    await userSubscription.save();
    res.status(201).json(userSubscription);
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing user', error });
  }
};

const getUserSubscriptionDetails = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({ userId: req.user._id }).populate('planId');
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription details', error });
  }
};

module.exports = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  subscribeUserToPlan,
  getUserSubscriptionDetails,
};
