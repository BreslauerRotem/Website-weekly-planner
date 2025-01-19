/*********************************************
 * 1) Load Environment Variables (dotenv)
 *********************************************/
require('dotenv').config(); // <-- This must be at the very top

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

/*********************************************
 * Import Models & Routes
 *********************************************/
const User = require('./models/User'); // Your user model
const plannerRoutes = require('./routes/plannerRoutes'); // Your planner routes

/*********************************************
 * Initialize Express App
 *********************************************/
const app = express();

// Enable CORS (so your React frontend can call your backend)
app.use(cors());

// Parse incoming JSON
app.use(express.json());

/*********************************************
 * 2) Connect to MongoDB Using .env Variables
 *********************************************/
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB:', process.env.MONGO_URI))
  .catch((error) => console.error('MongoDB connection error:', error));

/*********************************************
 * 3) Routes
 *********************************************/
// All routes for planner features (including generate-recommendations)
// are in plannerRoutes.js
app.use('/api/planner', plannerRoutes);

/*********************************************
 * 4) Authentication & User Management
 *********************************************/

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // If login is successful, return user data
    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        hobbies: user.hobbies || [],
        freeTime: user.freeTime || [],
        currentLocation: user.currentLocation || '',
      },
    });
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Check if username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      hobbies: [],
      freeTime: [],
      currentLocation: null,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error in /signup:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Update Hobbies Endpoint
app.post('/update-hobbies', async (req, res) => {
  const { username, hobbies } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { hobbies },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Hobbies updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in /update-hobbies:', error);
    res.status(500).json({ message: 'Error updating hobbies' });
  }
});

// Update Free Time Endpoint
app.post('/update-free-time', async (req, res) => {
  const { username, freeTime, currentLocation } = req.body;

  try {
    if (!username || !freeTime || !currentLocation) {
      return res.status(400).json({ message: 'Invalid input data.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          freeTime,
          currentLocation,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Free time and location updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in /update-free-time:', error);
    res.status(500).json({ message: 'Error updating free time' });
  }
});

// Fetch User Data Endpoint
app.get('/get-user-data', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      hobbies: user.hobbies || [],
      freeTime: user.freeTime || [],
      currentLocation: user.currentLocation || '',
    });
  } catch (error) {
    console.error('Error in /get-user-data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

/*********************************************
 * 5) Start the Server Using .env PORT
 *********************************************/
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
