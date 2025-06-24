const emailService = require('../services/emailService');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact')

const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Log submission
  console.log('New Contact Submission:', { name, email, subject, message });

  try {
    const contactors = new Contact({ name, email, subject, message });
    await contactors.save();
    // Send notification to the support team
    await emailService.sendSupportNotificationEmail({ name, email, subject, message });


    // Send acknowledgment email to the user

    await emailService.sendContactThankYouEmail(email, name);
    res.status(200).json({ message: 'Message received and acknowledgment email sent!' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};


const getMessages = async (req, res) => {
  const { email, name, status, page = 1, limit = 10 } = req.query;
  console.log('Request Query:', req.query);
  // console.log('Request Body:', req.body);


  try {
    // Build query dynamically
    const query = {};
    if (email) query.email = email;
    if (name) query.name = new RegExp(name, 'i'); // Case-insensitive regex for names
    if (status === 'replied') query.isReplied = true;
    if (status === 'unreplied') query.isReplied = false;

    // Fetch counts for replied and unreplied
    const repliedCount = await Contact.countDocuments({ isReplied: true });
    const unrepliedCount = await Contact.countDocuments({ isReplied: false });

    // Paginate and fetch messages
    const totalMessages = await Contact.countDocuments(query);
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Respond with data
    res.status(200).json({
      success: true,
      data: messages,
      totalCount: totalMessages,
      page: parseInt(page),
      totalPages: Math.ceil(totalMessages / limit),
      counts: { replied: repliedCount, unreplied: unrepliedCount },
    });
  } catch (error) {
    console.error('Error fetching messages:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Error fetching messages.' });
  }
};




const sendReply = async (req, res) => {
  const { id, recipientEmail, recipientName, subject, replyContent, supportName } = req.body;
  // console.log('Request Query:', req.query);
  console.log('Request Body:', req.body);


  // Validate required fields
  if (!id || !recipientEmail || !subject || !replyContent || !supportName) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Find the message in the database
    const message = await Contact.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    // Simulate sending an email
    console.log(`Reply sent to ${recipientEmail} (${recipientName})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${replyContent}`);
    console.log(`From: ${supportName}`);

    // Update the database
    message.isReplied = true;
    await message.save();

    // Call email service to send the reply (mock or real)
    await emailService.sendReplyEmail({
      recipientEmail,
      subject,
      replyContent,
      recipientName,
      supportName,
    });

    res.status(200).json({ success: true, message: 'Reply sent successfully.' });
  } catch (error) {
    console.error('Error sending reply:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Failed to send reply.' });
  }
};



const sendFeedback = async (req, res) => {
  try {
    const { name, email, phone, feedback_type, feedback_category, message } = req.body;

    // Validate fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use another service
      auth: {
        user: process.env.EMAIL_USER,  // Your email (from .env file)
        pass: process.env.EMAIL_PASS,  // Your email password (from .env file)
      },
    });

    // Prepare the email options
    const mailOptions = {
      from: email,
      to: process.env.FEEDBACK_RECEIVER, // Email address where feedback will be sent
      subject: `Feedback from ${name} (${feedback_type})`,
      html: `
              <h3 style="font-family: 'Arial', sans-serif; color: #333; font-size: 24px; margin-bottom: 10px;">Feedback from ${name}</h3>

<p style="font-family: 'Arial', sans-serif; color: #555; font-size: 16px; margin: 5px 0;">
    <strong style="font-weight: bold; color: #000;">Email:</strong> ${email}
</p>

<p style="font-family: 'Arial', sans-serif; color: #555; font-size: 16px; margin: 5px 0;">
    <strong style="font-weight: bold; color: #000;">Phone:</strong> ${phone || 'N/A'}
</p>

<p style="font-family: 'Arial', sans-serif; color: #555; font-size: 16px; margin: 5px 0;">
    <strong style="font-weight: bold; color: #000;">Category:</strong> ${feedback_category}
</p>

<p style="font-family: 'Arial', sans-serif; color: #555; font-size: 16px; margin: 5px 0;">
    <strong style="font-weight: bold; color: #000;">Message:</strong>
</p>

<p style="font-family: 'Arial', sans-serif; color: #555; font-size: 16px; margin: 10px 0 20px 0; line-height: 1.5;">
    ${message}
</p>

          `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({ message: 'Thank you for your feedback!' });

  } catch (error) {
    console.error('Error sending feedback email:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};





module.exports = {
  submitContactForm,
  getMessages,
  sendReply,
  sendFeedback,
};