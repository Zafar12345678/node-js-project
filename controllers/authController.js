const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
const fs = require('fs');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET;

// async function signup(req, res) {
//   const { name, email, Type, mobile, password } = req.body;

//   try {
//     // Check if the user already exists by email
//     const existingUserByEmail = await User.findOne({ email });

//     if (existingUserByEmail) {
//       return res.status(409).json({ message: 'Email already exists' });
//     }

//     // Check if the user already exists by mobile number
//     const existingUserByMobile = await User.findOne({ mobile });

//     if (existingUserByMobile) {
//       return res.status(409).json({ message: 'Mobile number already exists' });
//     }

//     // Validate that the password is not empty
//     if (!password) {
//       return res.status(400).json({ message: 'Password cannot be empty' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       Type,
//       mobile,
//       password: hashedPassword,
//     });

//     // Check if a photo was sent in the request
//     if (req.files && req.files['photo'] && req.files['photo'][0]) {
//       newUser.photo = req.files['photo'][0].filename;
//     }

//     const result = await newUser.save();

//     res.json({ user: result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// }

async function signup(req, res) {
  const { name, email, Type, mobile, password } = req.body;

  try {
    // Check if the user already exists by email
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Check if the user already exists by mobile number
    const existingUserByMobile = await User.findOne({ mobile });

    if (existingUserByMobile) {
      return res.status(409).json({ message: 'Mobile number already exists' });
    }

    // Validate that the password is not empty
    if (!password) {
      return res.status(400).json({ message: 'Password cannot be empty' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      Type,
      mobile,
      password: hashedPassword,
    });

    // Check if a photo was sent in the request
    if (req.files && req.files['photo'] && req.files['photo'][0]) {
      // Assuming 'photo' is a string field to store the filename
      newUser.photo = req.files['photo'][0].filename;
    }

    const result = await newUser.save();

    res.json({ user: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}



async function login(req, res) {
  const { email, mobile, password } = req.body;

  console.log('Received login request:', { email, mobile, password }); // Debugging log

  try {
    const isEmail = /\S+@\S+\.\S+/.test(email);

    // Check if the 'email' or 'mobile' is provided
    if (!isEmail && !mobile) {
      return res.status(400).json({ message: 'Email or mobile number is required' });
    }

    // Find the user based on email or mobile number
    let user;

    // Find the user based on email or mobile number
    if (isEmail) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, mobile: user.mobile, id: user._id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    // Include user details in the response
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}




async function updatePassword(req, res) {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Find the user based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



// GET user by ID
const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// UPDATE user by ID
const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const { name, email, Type, mobile, password } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user properties
    if (name) user.name = name;
    if (email) user.email = email;
    if (Type) user.Type = Type;
    if (mobile) user.mobile = mobile;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Check if a photo was sent in the request and update it
    if (req.files && req.files['photo'] && req.files['photo'][0]) {
      user.photo = req.files['photo'][0].filename;
    }

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};








module.exports = {
  signup,
  login,
  updatePassword,
  getUserById,
  updateUserById
};
