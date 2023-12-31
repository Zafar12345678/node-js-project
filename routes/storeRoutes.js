const express = require('express');
const storeController = require('../controllers/storeController'); 
// const storeController = require('../../../Downloads/Salon_API-master/Salon_API-master/controllers/storeController'); // Change to storeController
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
router.post('/addstore',upload.array('logo',5),storeController.create_store); // Change to storeController

//find near store get
router.post('/nearstore',storeController.find_near_store); // Change to storeController

module.exports = router;
