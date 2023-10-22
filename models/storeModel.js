const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    reviewerName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Set the minimum rating value (e.g., 1)
        max: 5, // Set the maximum rating value (e.g., 5)
    },
    comments: String, // Optional comments from the reviewer
}, {
    timestamps: true, // Include a timestamp for when the review was created
});

const storeSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    vender_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    logo: {
        type: Array,
        // required: true,
    },
    business_email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    currentBooking:[],
    location: {
        type: {
            type: String,
            default: 'Point', // Set the default type to 'Point' for 2dsphere index
            required: true,
        },
        coordinates: {
            type: [Number], // Use Number array to represent coordinates
            required: true,
        },
    },
    reviews: [reviewSchema], // Add an array field for storing customer reviews
    averageRating: {
        type: Number,
        default: 0, // Set the default average rating to 0
    },
}, {
    timestamps: true,
});

// Define a 2dsphere index for the location field
storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('store', storeSchema);
