const cron = require('node-cron');
const Subscriber = require('../models/Subscriber');
const emailService = require('../services/emailService');
const Post = require('../models/Post');
const { htmlToText } = require('html-to-text');
const jwt = require('jsonwebtoken');



// Subscribe a user
const subscribe = async (req, res) => {
    const { username, email, type, niches } = req.body;

    // Validation
if (type === "Newsletter") {
    if (!username || !email || !type || !Array.isArray(niches) || niches.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, type, and at least one category are required for Newsletter subscriptions.',
        });
    }
} else {
    if (!email || !type || !username) {
        return res.status(400).json({
            success: false,
            message: 'Email, type, and Username are required.',
        });
    }
}


    const allowedTypes = ['Newsletter', 'Updates'];
    const allowedCategories = [
        "Technology", "Sports", "Entertainment", "Science", "Health",
        "Lifestyle", "Education", "Romance", "Politics", "Business",
        "Travel", "Fashion",
    ];

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid subscription type.' });
    }

    const invalidNiches = niches.filter((niche) => !allowedCategories.includes(niche));
    if (invalidNiches.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Invalid category: ${invalidNiches.join(', ')}`,
        });
    }

    try {
        // Check for existing subscription
        const existingSubscription = await Subscriber.findOne({ username, email, type });
        if (existingSubscription) {
            return res.status(409).json({ success: false, message: 'You are already subscribed.' });
        }

        // Save the new subscription
        const subscription = new Subscriber({ username, email, type, niches });
        await subscription.save();

        // Send Thank You email
        await emailService.sendThankYouEmail(email, type, niches, username, subscription._id);

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing!',
        });
    } catch (error) {
        console.error('Error in subscribe:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};


// Unsubscribe a user
const unsubscribe = async (req, res) => {
    const { id } = req.params; // Match the parameter name in the route
    console.log('Request Param (ID):', id);

    try {
        // Find the subscription by ID
        const subscription = await Subscriber.findById(id);
        console.log('Subscription Found:', subscription);

        if (!subscription || subscription.isUnsubscribed) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found or already unsubscribed.',
            });
        }

        // Update subscription status
        subscription.isUnsubscribed = true;
        await subscription.save();

        // Send unsubscribe confirmation email
        await emailService.sendUnsubscribeEmail(subscription.email, subscription.username, subscription.type);

        res.status(200).json({
            success: true,
            message: `Successfully unsubscribed from ${subscription.type}.`,
        });
    } catch (error) {
        console.error('Error in unsubscribe:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};



// Fetch subscriptions
// Fetch subscriptions with pagination and filtering
const getSubscriptions = async (req, res) => {
    const { email, type, niche, username, status, page = 1, limit = 10 } = req.query;

    try {
        const query = {};
        if (email) query.email = email;
        if (type) query.type = type;
        if (niche) query.niches = niche;
        if (username) query.username = username;

        if (status === 'active') {
            query.isUnsubscribed = false;
        } else if (status === 'unsubscribed') {
            query.isUnsubscribed = true;
        }

        // Counts for various subscriber categories
        const activeCount = await Subscriber.countDocuments({ isUnsubscribed: false });
        const unsubscribedCount = await Subscriber.countDocuments({ isUnsubscribed: true });
        const newsletterCount = await Subscriber.countDocuments({ type: 'Newsletter' });
        const updatesCount = await Subscriber.countDocuments({ type: 'Updates' });

        // Count total subscriptions matching the query
        const totalSubscriptions = await Subscriber.countDocuments(query);

        // Paginate subscriptions
        const subscriptions = await Subscriber.find(query)
            .sort({ subscribedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: subscriptions,
            totalCount: totalSubscriptions,
            page: parseInt(page),
            totalPages: Math.ceil(totalSubscriptions / limit), // Calculate total pages
            counts: {
                active: activeCount,
                unsubscribed: unsubscribedCount,
                newsletter: newsletterCount,
                updates: updatesCount,
            },
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};


// Resubscribe a user
const resubscribeUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find subscription by ID
        const subscription = await Subscriber.findById(id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found.' });
        }

        // Update subscription status
        subscription.isUnsubscribed = false;
        await subscription.save();

        // Extract necessary details from the subscription
        const { email, type, niches, username } = subscription;

        // Send Thank You email
        await emailService.sendThankYouEmail(email, type, niches, username, subscription._id);

        res.status(200).json({
            success: true,
            message: `The user with email ${email} has been re-subscribed.`,
        });
    } catch (error) {
        console.error('Error in resubscribe:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


// Track engagement
const trackEngagement = async (req, res) => {
    const { event, email } = req.body;

    try {
        if (event === 'opened') {
            await Subscriber.updateOne(
                { username },
                { $inc: { 'engagement.openRate': 1 } }
            );
        } else if (event === 'clicked') {
            await Subscriber.updateOne(
                { username },
                { $inc: { 'engagement.clickRate': 1 } }
            );
        }

        res.status(200).send('Event tracked successfully.');
    } catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).send('Error tracking event.');
    }
};


const getTopPostsByCategory = async (categories, timeFrame = 'week') => {
    const dateFrom = new Date();
    if (timeFrame === 'week') {
        dateFrom.setDate(dateFrom.getDate() - 14); // 1 week ago
    } else {
        // Can implement other time frames like 'month' or 'day'
    }

    console.log(`Fetching top posts for category: ${categories}`);
    const posts = await Post.find({
        status: "Published",
        categories: categories,
        createdAt: { $gte: dateFrom },  // Filter posts from the last week
    })
    .sort({ 
        views: -1,
        comments: -1,
        reactions: -1, 
    })
    .limit(3);  // Get top 5 posts
    console.log(`Posts for ${categories}:`, posts);

    return posts;
};


const sendNewsletterNow = async (req, res) => {
    try {

        const subjects = [
            "Your Weekly Dose of Inspiration Awaits! 🌟",
            "Top 5 Stories You Can’t Miss This Week 📖",
            "Handpicked Highlights Just for You! 💌",
            "What’s Trending in Your Favorite Categories? 🔥",
            "Discover the Gems You’ll Love This Week ✨",
            "Tailored Updates, Just for You 🎯",
            "The Week’s Best in [Niche/Category]! 🚀",
            "Your Personalized Guide to This Week’s Buzz 🗞️",
            "Stay Ahead: The Top Posts of the Week 📬",
            "Hot Off the Press! Your Exclusive Weekly Digest 📰"
        ];

        console.log('Request:', req.body)

        // Fetch active subscribers
        const subscribers = await Subscriber.find({ type: 'Newsletter', isUnsubscribed: false }, 'email username niches');

        console.log('Fetched Subscribers:', subscribers);
            

        // Send the newsletter to each subscriber
        for (const subscriber of subscribers) {
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

            // Prepend the username
            const emailSubject = `${subscriber.username}, ${randomSubject}`;

            if (!subscriber.niches || subscriber.niches.length === 0) {
                console.log(`Skipping subscriber ${subscriber.email}: No niches found.`);
                continue; // Skip this subscriber
            }

            const postsByCategory = await Promise.all(subscriber.niches.map(async (categories) => {
                const posts = await getTopPostsByCategory(categories);
                const formattedPosts = posts.map(post => ({
                    ...post._doc, 
                    truncatedContent: htmlToText(post.content, {
                        wordwrap: false, 
                        limits: { maxInputLength: 200 }, 
                    }).slice(0, 200), 
                }));
                return { categories, posts: formattedPosts };
            }));
            

            console.log('Posts Emails:', postsByCategory)

            await emailService.sendGenericEmail(
                subscriber.email,
                emailSubject,  
                subscriber.username,  
                subscriber.niches, 
                postsByCategory  
            );
        }

        res.status(200).json({ message: 'Newsletter sent successfully!' });
    } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).json({ error: 'Failed to send newsletter' });
    }
};

const scheduleNewsletter = async (req, res) => { 
    try {
        // Schedule the newsletter task for every Monday at 9 AM
        cron.schedule('0 9 * * 1', async () => {
            console.log('Cron job triggered at:', new Date());
            
            await sendNewsletterNow(req, res); 
        });

        res.status(200).json({ message: 'Newsletter scheduled successfully!' });
    } catch (error) { 
        console.error('Error scheduling newsletter:', error);
        res.status(500).json({ error: 'Failed to schedule newsletter' });
    }
};


const sendNewsletterManually = async (req, res) => {
    try {
        console.log("Manual trigger for sending newsletter initiated.");
        await sendNewsletterNow(req, res); // Assuming this function contains your newsletter logic
        res.status(200).json({ message: 'Newsletter sent successfully!' });
    } catch (error) {
        console.error('Error sending newsletter manually:', error);
        res.status(500).json({ error: 'Failed to send newsletter manually' });
    }
};




module.exports = {
    subscribe,
    unsubscribe,
    getSubscriptions,
    resubscribeUser,
    trackEngagement,
    sendNewsletterNow,
    scheduleNewsletter,
    sendNewsletterManually,
};








// Subscribe handler
// const subscribe = async (req, res) => {
//     const { email, type } = req.body;

//     if (!email || !type) {
//         return res.status(400).json({ success: false, message: 'Email and type are required.' });
//     }

//     // Validate subscription type
//     const allowedTypes = ['Newsletter', 'Updates'];
//     if (!allowedTypes.includes(type)) {
//         return res.status(400).json({ success: false, message: 'Invalid subscription type.' });
//     }

//     try {
//         // Check if the email is already subscribed
//         const existingSubscription = await Subscriber.findOne({ email, type });
//         if (existingSubscription) {
//             return res.status(409).json({ success: false, message: 'You are already subscribed.' });
//         }

//         // Save subscription to database
//         const subscription = new Subscriber({ email, type });
//         await subscription.save();

//         // Send welcome/thank-you email
//         await emailService.sendThankYouEmail(email, type);

//         res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
//     } catch (error) {
//         console.error('Error in subscribe:', error);
//         res.status(500).json({ success: false, message: 'Internal server error.' });
//     }
// };