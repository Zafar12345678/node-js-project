const express = require('express');
const storecategoryController = require('../controllers/storecategoryController');
const router = express.Router();

// Define your routes
router.post('/addstorecategory', storecategoryController.addCategory);
router.get('/storecategory', storecategoryController.getCategories);
router.put('/storecategories/:categoryId', storecategoryController.updateCategory);
router.delete('/storecategories/:categoryId', storecategoryController.deleteCategory);

// Export the router
module.exports = router;
