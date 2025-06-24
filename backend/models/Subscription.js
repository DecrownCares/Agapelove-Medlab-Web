const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userType: { type: String, enum: ['patient', 'visitor'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: false }, // link to patient if registered
  endpoint: { type: String, required: true, unique: true },
  expirationTime: { type: Number, required: false },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now }
});


const Subscriber = mongoose.model('Subscriber', subscriptionSchema);
module.exports = Subscriber;
