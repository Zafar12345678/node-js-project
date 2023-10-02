const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    storename: {
        type: String,
        required: true,
    },
    store_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String, // Assuming user_id is a single string, not an array
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timeslots: {
        type: [], // Define the data type for timeslots accordingly, e.g., [String]
    },
    category_id: {
        type: String,
        required: true,
    },
  
    totalamount: {
        type: Number,
        required: true,
        // Add validation if needed
    },
    transaction_id: {
        type: String, // Assuming transaction_id is a string
        // Add validation if needed
    },
    status: {
        type: String,
        required: true,
        default: "booked"
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Bookings', bookingSchema);
