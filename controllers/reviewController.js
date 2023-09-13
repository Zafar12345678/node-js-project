const Store = require('../models/storeModel');

// Controller function to add a review to a store
const addReviewToStore = async (req, res) => {
    try {
        const { storeId, userId } = req.params; // Get both storeId and userId from the route parameters
        const { reviewerName, rating, comments } = req.body;

        // Check if the user has already reviewed this store
        const existingReview = await Store.findOne({
            _id: storeId,
            'reviews.userId': userId,
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this store' });
        }

        // Create a new review object
        const newReview = {
            userId,
            reviewerName,
            rating,
            comments,
        };

        // Find the store by ID
        const store = await Store.findById(storeId);

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        // Add the new review to the store's reviews array
        store.reviews.push(newReview);

        // Calculate the average rating for the store
        const totalRatings = store.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRatings / store.reviews.length;

        // Update the store's average rating
        store.averageRating = averageRating;

        // Save the updated store document
        await store.save();

        res.status(200).json({ success: true, message: 'Review added to the store successfully', data: store });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    addReviewToStore,
};
