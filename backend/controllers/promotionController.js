const Promotion = require('../models/Promotion');
const emailService = require('../services/emailService');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');

const createPromotion = async (req, res) => {
    const { title, content, senderName, link } = req.body;

    console.log('Request from Client:', req.body);

    if (!title || !content || !senderName || !link) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Fetch active subscribers with email and name
        const activeSubscribers = await Subscriber.find(
            { isUnsubscribed: false },
            'email username'
        );

        // Fetch users who opted in for promotions with email and username
        const optedInUsers = await User.find(
            { isOptedInForPromotions: true },
            'email username'
        );

        // Combine and map emails with names
        const recipients = [
            ...activeSubscribers.map(sub => ({
                email: sub.email,
                username: sub.username,
            })),
            ...optedInUsers.map(user => ({
                email: user.email,
                name: user.username,
            })),
        ];

        // Save promotion to the database
        const newPromotion = new Promotion({
            title,
            content,
            link,
            senderName,
            sentAt: new Date(),
            recipients: recipients.map(r => r.email), // Store only emails in DB
        });
        await newPromotion.save();

        // Send promotional emails
        for (const recipient of recipients) {
            await emailService.sendPromotionalEmail({
                email: recipient.email,
                title,
                senderName,
                recipientName: recipient.username,
                content,
                link,
                unsubscribeLink: `https://yourapp.com/unsubscribe?email=${recipient.email}`,
                preferencesLink: `https://yourapp.com/preferences?email=${recipient.email}`,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Promotion created and sent successfully.',
            recipientCount: recipients.length,
        });
    } catch (error) {
        console.error('Error creating promotion:', error);
        res.status(500).json({ success: false, message: 'Failed to create promotion.' });
    }
};





const getPromotions = async (req, res) => {
    const { title, link, sender, sort = 'createdAt-desc', page = 1, limit = 10 } = req.query;

    try {
        const query = {};
        if (title) query.title = new RegExp(title, 'i');
        if (link) query.link = new RegExp(link, 'i');
        if (sender) query.senderName = new RegExp(sender, 'i');

        const sortOptions = sort.split('-');
        const sortField = sortOptions[0];
        const sortOrder = sortOptions[1] === 'asc' ? 1 : -1;

        const totalCount = await Promotion.countDocuments(query);
        const promotions = await Promotion.find(query)
            .sort({ [sortField]: sortOrder })
            .select('title senderName sentAt isArchived')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: promotions,
            totalCount,
            page: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error('Error fetching promotions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch promotions.' });
    }
};



const resendPromotion = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findById(id);
        if (!promotion) {
            return res.status(404).json({ success: false, message: 'Promotion not found.' });
        }

        // Fetch active subscribers
        const activeSubscribers = await Subscriber.find({ isUnsubscribed: false }, 'email username');
        console.log('Active Subscribers:', activeSubscribers);

        if (!activeSubscribers || activeSubscribers.length === 0) {
            return res.status(400).json({ success: false, message: 'No active subscribers found.' });
        }

        // Combine both groups of recipients (active subscribers and opted-in users)
        const recipients = [
            ...activeSubscribers.map(sub => ({
                email: sub.email,
                username: sub.username,
            })),
        ];

        console.log('Recipients:', recipients);  // Debug log to check the recipients data

        // Send promotional emails
        for (const recipient of recipients) {
            try {
                await emailService.sendPromotionalEmail({
                    email: recipient.email,
                    title: promotion.title,
                    senderName: promotion.senderName,
                    recipientName: recipient.username, // Or recipient.name if that's what you're using
                    content: promotion.content,
                    link: promotion.link,
                    unsubscribeLink: `https://yourapp.com/unsubscribe?email=${recipient.email}`,
                    preferencesLink: `https://yourapp.com/preferences?email=${recipient.email}`,
                });
            } catch (error) {
                console.error(`Failed to send promotional email to ${recipient.email}:`, error);
            }
        }

        res.status(200).json({ success: true, message: 'Promotion resent successfully.' });
    } catch (error) {
        console.error('Error resending promotion:', error);
        res.status(500).json({ success: false, message: 'Failed to resend promotion.' });
    }
};



const deletePromotion = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findByIdAndDelete(id);
        if (!promotion) {
            return res.status(404).json({ success: false, message: 'Promotion not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Promotion deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ success: false, message: 'Failed to delete promotion.' });
    }
};

module.exports = {
    createPromotion,
    getPromotions,
    resendPromotion,
    deletePromotion,
};

