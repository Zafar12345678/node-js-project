const Booking = require('../models/bookingModel');
const moment = require("moment");
const Store = require('../models/storeModel');

//  a booking
const booking_order = async (req, res) => {
    const { storename, store_id, user_id, date, timeslots, category_id, totalamount, transection_id } = req.body;

    try {
        // Create a new booking
        const newbooking = new Booking({
            storename,
            store_id,
            user_id,
            date: moment().subtract(10, 'days').calendar(),
            timeslots,
            category_id,
            totalamount,
            transection_id
        });

        const bookingData = await newbooking.save();

        // Fetch the corresponding store
        const store = await Store.findById(store_id);

        // Check if the store is null or undefined
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Add the booking data to the store's currentBooking array
        store.currentBooking.push({
            storename,
            date: moment().subtract(10, 'days').calendar(),
            timeslots,
            user_id,
            bookingid: bookingData._id,
            status: bookingData.status
        });
        await store.save();

        // Send a success response with a 200 status code
        res.status(200).send("Room Book Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', msg: error.message });
    }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
    const { bookingId, store_id } = req.body;

    try {
        // Find the booking by its ID
        const bookingitem = await Booking.findById({ _id: bookingId });

        if (!bookingitem) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the booking's status to "cancelled"
        bookingitem.status = 'cancelled';
        await bookingitem.save();

        // Fetch the corresponding store
        const store = await Store.findById(store_id);

        // Check if the store is null or undefined
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Update the status of the booking within the store's currentBooking array
        store.currentBooking = store.currentBooking.map((booking) => {
            if (booking.bookingid.equals(bookingId)) {
                booking.status = 'cancelled';
            }
            return booking;
        });

        // Remove all bookings with status "cancelled" and matching bookingId from currentBooking array
        store.currentBooking = store.currentBooking.filter((booking) => {
            return !(booking.status === 'cancelled' && booking.bookingid.equals(bookingId));
        });

        await store.save();

        // Send a success response
        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



// Get all bookings for admin

// Get all bookings for admin
const getAllBookings = async (req, res) => {
    try {
        // Find all bookings
        const allBookings = await Booking.find();

        // If no bookings are found, return an empty array
        if (!allBookings || allBookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        // If bookings are found, send them as a response
        res.status(200).json({ allBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};






// Get user bookings
const getBookingbyId = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find the booking by its ID
        const booking = await Booking.findById(bookingId);

        // Check if the booking exists
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If the booking exists, send it as a response
        res.status(200).json({ booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};












module.exports = {
    booking_order,
    cancelBooking,
    getAllBookings,
    getBookingbyId
};
