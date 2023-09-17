const express = require('express');
const productController = require('../controllers/productControllers'); // Change to storeController
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set storage for uploaded images using multer
const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Define routes
router.post('/add-product', upload.array('images',5), productController.add_product); // Change to storeController
router.get('/get-product/:vendorName', productController.get_product); // Change to storeController

//find near store get
// router.post('/nearstore',storeController.find_near_store); 

module.exports = router;
