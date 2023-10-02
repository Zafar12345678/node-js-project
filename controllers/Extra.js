// const Booking = require('../models/bookingModel');
// const moment = require("moment");
// const Store = require('../models/storeModel');



// const booking_order = async (req, res) => {
//     const { storename, store_id, user_id, date, timeslots, category_id, sub_cat_id, totalanout, transection_id } = req.body

//     try {
//         const newbooking = new Booking({
//             storename,
//             store_id,
//             user_id,
//             date: moment(date).format('DD-MM-YYY'),
//             timeslots,
//             category_id,
//             sub_cat_id,
//             totalanout,
//             transection_id: "12344"
//         });
//         const bookingData = await newbooking.save();
//         const roomtem = await Store.findOne({ _id: Store._id });
//         roomtem.newBooking.push({
//             bookingid: Booking._id,
//             date: moment(date).format('DD-MM-YYY'),
//             timeslots,
//             user_id,
//             status: Booking.status
//         });
//         await roomtem.save()

//         res.send("Room Book Successfully");
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error', msg: error.message });
//     }
// };



// module.exports = {
//     booking_order,

// };
