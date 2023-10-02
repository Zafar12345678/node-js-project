const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// Define your routes
router.post('/booking', bookingController.booking_order);

// /cancel booking
router.post('/cancel-booking', bookingController.cancelBooking);

// add min
router.get('/admin/bookings', bookingController.getAllBookings);

// Get user bookings by Id
router.get('/bookings/:bookingId', bookingController.getBookingbyId);

// Export the router
module.exports = router;
