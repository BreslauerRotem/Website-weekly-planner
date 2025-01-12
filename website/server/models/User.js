const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hobbies: { type: [String], default: [] }, // Array of strings for hobbies
  freeTime: { // Array of free time slots
    type: [
      {
        day: { type: String, required: true }, // e.g., "Monday"
        start: { type: String, required: true }, // e.g., "14:00"
        end: { type: String, required: true }, // e.g., "16:00"
      }
    ],
    default: []
  },
  currentLocation: {
    type: String,
    default: '',
  },
  planners: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Planner' 
  }] // References to Planner documents
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
