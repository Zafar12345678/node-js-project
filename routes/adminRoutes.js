const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const storeController = require('../controllers/storeController');
const storecategoryController = require('../controllers/storecategoryController');
const productController = require('../controllers/productControllers'); // Change to storeController
const serviceController = require('../controllers/serviceController');
const router = express.Router();
const multer = require("multer");
const path = require("path");


// Set storage for uploaded images using multer
const storage = multer.diskStorage({
    destination: "./public/storeImage/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
// Initialize multer upload
const upload = multer({ storage: storage });

// Define routes
router.post('/addstore', upload.array('logo', 5), storeController.create_store); // Change to storeController

//find near store get
router.post('/nearstore', storeController.find_near_store); // Change to storeController



// Define routes for adding and getting services
router.post('/addservices', serviceController.addServices);
router.get('/services', serviceController.getServices);


// Booking user list 
router.get('/admin/bookings', bookingController.getAllBookings);

// Get user bookings by Id
router.get('/bookings/:bookingId', bookingController.getBookingbyId);






// add category your routes
router.post('/addstorecategory', storecategoryController.addCategory);
router.get('/storecategory', storecategoryController.getCategories);
router.put('/storecategories/:categoryId', storecategoryController.updateCategory);
router.delete('/storecategories/:categoryId', storecategoryController.deleteCategory);





// Export the router
module.exports = router;
