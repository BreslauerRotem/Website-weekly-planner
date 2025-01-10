const express = require('express'); // imports the Express library for handling HTTP requests
const mongoose = require('mongoose');const cors = require('cors'); // imports the CORS (Cross-Origin Resource Sharing) middleware. CORS is used to allow or restrict requested resources on a web server based on the origin of the request. This is important when your frontend and backend are served from different origins.
require('dotenv').config(); //imports the dotenv package, which loads environment variables from a .env file into process.env. This is where is stored sensitive information, such as MongoDB connection string, without hardcoding it into source code.
	
const app = express(); // initializes an Express application instance
const PORT = process.env.PORT || 5000; // sets the port number of the server

// middleware
app.use(cors()); // enables CORS for all routes in your Express application. It allows your React frontend (which might be running on a different port, like 3000) to make API requests to your Node.js backend (running on port 5000) without being blocked by the browser.
app.use(express.json()); // enables acces JSON data sent in HTTP requests

// MongoDB connection URI
const MONGO_URI = 'mongodb://localhost:27017/weekly_planner';
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Enable the new topology engine
  })
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

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
