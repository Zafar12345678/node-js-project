const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: String,
  categoryId: String, // Custom unique identifier
  subcategories: [String],
},{ timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
