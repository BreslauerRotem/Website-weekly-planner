const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing and comparison
const User = require('./models/User'); // Import the User model
const plannerRoutes = require('./routes/plannerRoutes'); // Planner routes
// const userRoutes = require('./routes/userRoutes'); // Uncomment if you have user routes

const app = express();

const cors = require('cors');

// Enable CORS for all origins
app.use(cors());


// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/weekly_planner')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


// Routes
app.use('/api/planner', plannerRoutes); // Planner routes
// app.use('/api/user', userRoutes); // Uncomment if you have user routes

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

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, hobbies, freeTime, currentLocation } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      hobbies: hobbies || [], // Defaults to an empty array if not provided
      freeTime: freeTime || [], // Defaults to an empty array if not provided
      currentLocation: currentLocation || null, // Defaults to null if not provided
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});


// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
