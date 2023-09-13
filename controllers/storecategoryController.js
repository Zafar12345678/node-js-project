const storecategorySchema = require("../models/storecatogoryModel");

const addCategory = async (req, res) => {
  try {
    const { storecategory } = req.body;
    const newCategory = storecategory.toLowerCase(); // Convert the new category to lowercase

    const existingCategory = await storecategorySchema.findOne({ storecategory: newCategory });

    if (existingCategory) {
      return res.status(400).json({ success: false, msg: "This category already exists" });
    }

    const createdCategory = new storecategorySchema({ storecategory: newCategory });
    const savedCategory = await createdCategory.save();

    res.status(200).json({ success: true, msg: "Category data", data: savedCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get category and subcategory
const getCategories = async (req, res) => {
  try {
    const categories = await storecategorySchema.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { storecategory } = req.body;
    const newCategory = storecategory.toLowerCase();

    const existingCategory = await storecategorySchema.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    existingCategory.storecategory = newCategory; // Corrected the property name
    const updatedCategory = await existingCategory.save();

    res.status(200).json({ success: true, msg: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await storecategorySchema.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    await category.remove();
    res.status(200).json({ success: true, msg: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
