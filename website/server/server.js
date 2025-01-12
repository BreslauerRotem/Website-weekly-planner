const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model

const app = express(); // initializes an Express application instance
const PORT = process.env.PORT || 5000; // sets the port number of the server

// middleware
app.use(cors()); // enables CORS for all routes in your Express application. It allows your React frontend (which might be running on a different port, like 3000) to make API requests to your Node.js backend (running on port 5000) without being blocked by the browser.
app.use(express.json()); // enables acces JSON data sent in HTTP requests

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); // starts the server and listens for incoming requests on the specified PORT. Once the server is running, it logs a message to the console indicating that it is operational and which port it is listening on.
 

  const bcrypt = require('bcrypt'); // For password comparison
const User = require('./models/User'); // Import the User model

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
    const { username, email, password } = req.body;

    // Create a new user
    const newUser = new User({
      username,
      email,
      password, // IMPORTANT: Hash the password before saving in production
      hobbies: [],
      freeTime: [],
      currentLocation: null
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/weekly_planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.error('Database connection error:', err));
