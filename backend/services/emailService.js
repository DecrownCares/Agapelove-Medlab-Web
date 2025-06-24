const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Configure environment variables
dotenv.config();

handlebars.registerHelper('postUrl', function(post) {
    return `https://www.infohubnaija.com.ng/post/${post.slug}`;
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to read email templates
const getEmailTemplate = (templateName, replacements) => {
    try {
        const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
        let template = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders with actual values
        for (const [key, value] of Object.entries(replacements)) {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(placeholder, value);
        }

        return template;
    } catch (error) {
        console.error(`Error reading template "${templateName}":`, error);
        throw new Error('Template not found or invalid.');
    }
};


const intros = [
    "Welcome to this week's newsletter, tailored just for you! Here are the latest updates in your favorite categories:",
    "Another week, another roundup of the best content just for you. Dive into your favorite categories:",
    "We’ve curated the top stories in your favorite topics. Discover what’s buzzing this week:",
    "Here’s your weekly dose of inspiration and insights, handpicked to suit your interests:",
    "Your personalized highlights are here! Find out what’s trending in your favorite categories:",
    "Sit back, relax, and enjoy the latest updates from your favorite niches this week:",
    "Ready to explore this week's best? Here's what we’ve gathered from your chosen topics:",
    "Your weekly treasure trove of stories and updates is here! Let’s dive in:",
    "Stay informed and inspired! Here are the highlights from your preferred categories this week:",
    "It’s time to explore the gems of the week! Here’s what we’ve lined up for you:"
];

const getRandomIntro = () => intros[Math.floor(Math.random() * intros.length)];



// Send a thank-you email with unsubscribe link
const sendThankYouEmail = async (email, type, niches, username, subscriberId) => {
    // Generate unsubscribe link with JWT
    const unsubscribeLink = `http://infohubnaija.com.ng/unsubscribe/${jwt.sign(
        { subscriberId },
        process.env.JWT_SECRET || 'default_development_secret',
        { expiresIn: '7d' }
    )}`;

    // Create the email content
    const emailContent = getEmailTemplate('thankYou', {
        subscriptionType: type,
        unsubscribeLink,
        username,
        niches: niches.join(', '),
    });

    // Define mail options
    const mailOptions = {
        from: 'InfoHub',
        to: email,
        subject: `Thank You for Subscribing, ${username}!`,
        html: emailContent,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Thank You email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        throw new Error('Failed to send the Thank You email.');
    }
};

// Send an unsubscribe email with resubscribe link
const sendUnsubscribeEmail = async (email, username, type) => {
    const resubscribeLink = `https://www.infohubnaija.com./resubscribe/${jwt.sign(
        { email },
        process.env.JWT_SECRET || 'default_development_secret',
        { expiresIn: '7d' }
    )}`;

    const emailContent = getEmailTemplate('unsubscribeConfirmation', {
        subscriptionType: type,
        resubscribeLink,
        username,
    });

    const mailOptions = {
        from: 'Crowntips',
        to: email,
        subject: 'Unsubscribe Confirmation',
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Unsubscribe confirmation sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send unsubscribe confirmation to ${email}:`, error);
        throw new Error('Email service unavailable.');
    }
};

// Send a generic email (for newsletter, updates, etc.)
const sendGenericEmail = async (email, emailSubject, username, niches, postsByCategory) => {
    try {

        const templatePath = path.join(__dirname, 'templates', 'newsletter.html');
        const templateSource = fs.readFileSync(templatePath, 'utf8');

        // Compile the template using Handlebars
        const template = handlebars.compile(templateSource); 

        const randomIntro = getRandomIntro();

        const emailData = {
            emailSubject: emailSubject,
            username: username,
            intro: randomIntro,
            postsByCategory: postsByCategory
        };

        // Render the email content by passing data to the template
        const emailContent = template(emailData);

        console.log('Newsletter Email Data:', emailContent);

        await transporter.sendMail({
            from: 'support@infohub.com',
            to: email,
            subject: emailSubject,
            html: emailContent
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        throw new Error('Email service unavailable.');
    }
};


// Send a contact form thank-you email
const sendContactThankYouEmail = async (email, name) => {
    const emailContent = getEmailTemplate('thankYouContact', { name });

    const mailOptions = {
        from: 'InfoHub <support@infohub.com>',
        to: email,
        subject: `Thank You, ${name}!`,
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Acknowledgment email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send acknowledgment email to ${email}:`, error);
        throw new Error('Failed to send the acknowledgment email.');
    }
};

// Send a support team notification email (from the contact form)
const sendSupportNotificationEmail = async ({ name, email, subject, message }) => {
    const emailContent = getEmailTemplate('supportNotification', {
        name,
        email,
        subject,
        message,
    });

    console.log('Generated email content:', emailContent);

    const mailOptions = {
        from: 'InfoHub Notifications <notifications@infohub.com>',
        to: 'eluudecrown22@gmail.com',
        subject: 'New Contact Form Submission',
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Support team notification email sent.');
    } catch (error) {
        console.error('Failed to send support team notification email:', error);
        throw new Error(`Failed to send the support team notification email: ${error.message}`);
    }
};

// Original sendEmail function for custom emails (e.g., newsletters)
const sendEmail = async (to, subject, templateName, replacements) => {
    try {
        const emailContent = getEmailTemplate(templateName, replacements);

        const mailOptions = {
            from: 'InfoHub <support@infohubnaija.com.ng>',
            to,
            subject,
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw new Error('Email service unavailable.');
    }
};


const sendReplyEmail = async ({ replyContent, recipientEmail, subject, recipientName, supportName }) => {
    try {
        const emailContent = getEmailTemplate('replyTemplate', {
            subject,
            recipientName,
            replyContent,
            supportName,
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `Re: ${subject}`,
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
        throw new Error('Email service unavailable.');
    }
}


const sendPromotionalEmail = async ({
    email,
    title,
    link,
    senderName,
    recipientName,
    content,
    unsubscribeLink,
    preferencesLink,
}) => {
    try {
        const emailContent = getEmailTemplate('promotionTemplate', {
            title,
            senderName,
            content,
            link,
            recipientName,
            unsubscribeLink,
            preferencesLink,
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: title,
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Promotional email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send promotional email to ${email}:`, error);
        throw new Error('Email service unavailable.');
    }
};



module.exports = {
    sendThankYouEmail,
    sendUnsubscribeEmail,
    sendEmail,
    sendGenericEmail,
    sendContactThankYouEmail,
    sendSupportNotificationEmail,
    sendReplyEmail,
    sendPromotionalEmail,
};
