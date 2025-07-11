const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.signup = async (req, res) => {
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

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      role : newUser.role,
      email: newUser.email,
      phone: newUser.phone,
    };
    console.log("Session set:", req.session.user);

    res.status(201).json({ message: 'User saved successfully' });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error saving user', error });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'invalid credentials' });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'invalid credentials' });
    }  

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    console.log("Session set:", req.session.user);
    // Login successful
    res.status(200).json({ message: 'Login successful', user: req.session.user,});
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};





exports.session = (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
};



// Get all user accounts
exports.alluseraccounts = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


// Delete User
exports.deleteuser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};


// Get a user by ID
exports.singleuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error }); 
  }
};



// Update User

exports.updateuser = async (req, res) => {
  const { name, email, phone, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
}; 


exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie('connect.sid'); 
    res.json({ message: "Logged out successfully" });
  });
};


