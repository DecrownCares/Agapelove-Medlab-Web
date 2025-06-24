const webPush = require('web-push');
const dotenv = require('dotenv');
const Subscriber = require('../models/Subscription'); // Adjust path

dotenv.config();

webPush.setVapidDetails(
  'mailto:agapelovemedicallaboratory@gmail.com', // My contact email
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

// Push to one or all users
async function pushNotification({ title, body, target = 'all', userId = null }) {
  try {
    let subscribers;

    if (target === 'specific' && userId) {
      subscribers = await Subscriber.find({ userId });
    } else {
      subscribers = await Subscriber.find({});
    }

    for (const sub of subscribers) {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys.auth,
          p256dh: sub.keys.p256dh,
        },
      };

      const payload = JSON.stringify({ title, body });

      try {
        await webpush.sendNotification(pushSub, payload);
        console.log(`Notification sent to: ${sub.endpoint}`);
      } catch (err) {
        console.error('Push error:', err);
        // Optional: remove subscription if expired
      }
    }
  } catch (err) {
    console.error('Notification sending failed:', err);
  }
}

module.exports = pushNotification;
