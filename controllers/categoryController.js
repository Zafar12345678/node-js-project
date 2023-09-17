const Category = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const newCategory = category.toLowerCase(); // Convert the new category to lowercase

    const existingCategory = await Category.findOne({ category: newCategory });

    if (existingCategory) {
      return res.status(400).json({ success: false, msg: "This category already exists" });
    }

    const createdCategory = new Category({ category: newCategory });
    const savedCategory = await createdCategory.save();

    res.status(200).json({ success: true, msg: "Category data", data: savedCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const addSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategory } = req.body;

    // Check if subcategory is not null or empty
    if (!subcategory) {
      return res.status(400).json({ success: false, msg: "Subcategory cannot be null or empty" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    // Check if the subcategory already exists in the category
    if (category.subcategories.includes(subcategory)) {
      return res
        .status(400)
        .json({ success: false, msg: "Subcategory already exists in the category" });
    }

    // Add the subcategory to the category
    category.subcategories.push(subcategory);
    await category.save();

    res.status(200).json({ success: true, msg: "Subcategory added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//get category and subcategory
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(404).json({ success: false, message: 'No categories found' });
    }

    res.status(200).json({ success: true, data:categories });
  } catch (error) {
    console.error("Caught error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    const subcategories = category.subcategories;
    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//update category

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { category } = req.body;
    const newCategory = category.toLowerCase();

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    existingCategory.category = newCategory;
    const updatedCategory = await existingCategory.save();

    res.status(200).json({ success: true, msg: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    await category.remove();
    res.status(200).json({ success: true, msg: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



//update subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const { subcategory } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    // Check if the subcategory already exists in the category
    if (!category.subcategories.includes(subcategoryId)) {
      return res.status(404).json({ success: false, msg: "Subcategory not found in the category" });
    }

    // Update the subcategory
    const subcategoryIndex = category.subcategories.indexOf(subcategoryId);
    category.subcategories[subcategoryIndex] = subcategory;
    await category.save();

    res.status(200).json({ success: true, msg: "Subcategory updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//dleted subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, msg: "Category not found" });
    }

    // Check if the subcategory already exists in the category
    if (!category.subcategories.includes(subcategoryId)) {
      return res.status(404).json({ success: false, msg: "Subcategory not found in the category" });
    }

    // Remove the subcategory
    category.subcategories = category.subcategories.filter((subcat) => subcat !== subcategoryId);
    await category.save();

    res.status(200).json({ success: true, msg: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const get_category=async()=>{
  try {
      return Category.find();
  } catch (error) {
      res.status.send(error.message)
  }
}






module.exports = {
  addCategory,
  addSubcategory,
  getCategories,
  getSubcategoriesByCategory,
  updateCategory,
  deleteCategory,
  deleteSubcategory,
  updateSubcategory,
  get_category
};
