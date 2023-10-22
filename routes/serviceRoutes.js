const express = require('express');
const serviceController = require('../controllers/serviceController'); 
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
router.post('/addservices',upload.single("images")  ,serviceController.addServices); // Change to storeController

//find near store get
router.get('/getservices',serviceController.getServices); // Change to storeController
router.put('/update/:serviceId', upload.single('images'), serviceController.updateService);
router.delete('/delete/:serviceId', serviceController.deleteService);

module.exports = router;
