// api/routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User saved successfully' });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error saving user', error });
  }
});

module.exports = router;
