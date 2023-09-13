
const mongoose = require('mongoose');
const storeSchema = new mongoose.Schema({
    // ... Other fields ...

    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
                required: true,
                unique: true, // Ensure each user can only add one review
            },
            reviewerName: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            comments: String,
        },
    ],

    // ... Other fields ...
});

// ... Other schema configurations ...

module.exports = mongoose.model('Review', reviewSchema);
