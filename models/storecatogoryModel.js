const mongoose = require("mongoose");

const storecategorySchema = new mongoose.Schema({
    storecategory: { type: String, required: true, unique: true },

}, { timestamps: true });

const Category = mongoose.model("storeCategory", storecategorySchema);

module.exports = Category;
