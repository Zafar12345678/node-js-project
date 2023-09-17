const express = require('express');
const reviewController = require('../../../Downloads/Salon_API-master/Salon_API-master/controllers/reviewController');
const router = express.Router();

// Define your routes
router.post('/stores/:storeId/users/:userId/addreview', reviewController.addReviewToStore);
// Export the router
module.exports = router;
