const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

const sendNewsletter = async (subject, content) => {
  try {
    const subscribers = await Subscriber.find();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = subscribers.map((subscriber) =>
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: subject,
        html: content,
      })
    );

    await Promise.all(emailPromises);

    console.log('Newsletter sent successfully!');
  } catch (error) {
    console.error('Error sending newsletter', error);
  }
};

module.exports = sendNewsletter;
