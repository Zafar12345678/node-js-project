const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  Type: { type: String, required: true },
  photo: { type: String },
  password: { type: String, required: true }
}, { timestamps: true }); // Place timestamps option here

module.exports = mongoose.model('user', userSchema);
