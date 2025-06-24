const Ad = require('../models/Ad');

// Upload Ad Logic
const uploadAd = async (req, res) => {
    const { targetUrl, placeholders, description } = req.body;

    // Convert placeholders to an array of numbers
    const placeholdersArray = Array.isArray(placeholders)
        ? placeholders.map(Number)
        : [Number(placeholders)].filter(Boolean);

    if (!req.file || !targetUrl || placeholdersArray.length === 0) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if placeholders have room for new ads
        for (const placeholder of placeholdersArray) {
            const adCount = await Ad.countDocuments({ placeholders: placeholder });
            if (adCount >= 5) {
                return res.status(400).json({ error: `Placeholder ${placeholder} already has 5 ads.` });
            }
        }

        // Save ad to database
        const newAd = new Ad({
            imageUrl: `/uploads/${req.file.filename}`,
            targetUrl,
            placeholders: placeholdersArray,
            description, 
        });

        await newAd.save();
        res.status(201).json({ message: 'Ad uploaded successfully.', ad: newAd });
    } catch (error) {
        console.error("Error uploading Ad:", error); 
        res.status(500).json({ message: 'Server error. Please try again later.', error });
    }
};

// Fetch Ads for Display
const getAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        const groupedAds = {};

        // Group ads by placeholder
        ads.forEach((ad) => {
            ad.placeholders.forEach((placeholder) => {
                if (!groupedAds[placeholder]) groupedAds[placeholder] = [];
                groupedAds[placeholder].push(ad);
            });
        });

        res.status(200).json(groupedAds);
    } catch (err) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};


// Delete Ad Logic

const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);

        if (!ad) return res.status(404).json({ error: 'Ad not found.' });

        res.status(200).json({ message: 'Ad deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

module.exports = {
    uploadAd,
    getAds,
    deleteAd,
};