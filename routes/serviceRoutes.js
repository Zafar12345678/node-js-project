const express = require('express');
const serviceController = require('../controllers/serviceController'); 
const router = express.Router();



// Define routes
router.post('/addservices',serviceController.addServices); // Change to storeController

//find near store get
router.post('/getservices',serviceController.getServices); // Change to storeController

module.exports = router;
