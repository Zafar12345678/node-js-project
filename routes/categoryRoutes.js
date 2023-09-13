const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

// Create category
router.post('/addcategory', categoryController.addCategory);

// Create subcategory
router.post('/addsubcategory', categoryController.addSubcategory);

// Read all categories
router.get('/categories', categoryController.getCategories);

// Read subcategories for a category
router.get('/categories/:categoryId/subcategories', categoryController.getSubcategoriesByCategory);

// Update a category
router.put('/categories/:categoryId', categoryController.updateCategory);

// Delete a category
router.delete('/categories/:categoryId', categoryController.deleteCategory);

// Update a subcategory within a category
router.put('/categories/:categoryId/subcategories/:subcategoryId', categoryController.updateSubcategory);

// Delete a subcategory within a category
router.delete('/categories/:categoryId/subcategories/:subcategoryId', categoryController.deleteSubcategory);

module.exports = router;
