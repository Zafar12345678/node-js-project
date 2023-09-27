const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Auth = require("../middleware/auth")

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
router.post('/signup', upload.fields([
  { name: 'photo', maxCount: 1 }
]), authController.signup);

router.post('/login', Auth, authController.login);
router.post('/update-password', authController.updatePassword);

module.exports = router;
