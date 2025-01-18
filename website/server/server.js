const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing and comparison
const User = require('./models/User'); // Import the User model
const plannerRoutes = require('./routes/plannerRoutes'); // Planner routes

const app = express();

const cors = require('cors');

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/weekly_planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/planner', plannerRoutes); // Planner routes

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

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
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.error('Error saving user:', error);
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
    console.error('Error updating hobbies:', error);
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
    console.error('Error updating free time:', error);
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
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
