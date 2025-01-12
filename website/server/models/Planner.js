const mongoose = require('mongoose');

// Define the Planner schema
const plannerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User who created this planner
  hobbies: { 
    type: [String], 
    default: [] 
  }, // Hobbies for this planner
  freeTime: { 
    type: [
      {
        day: { type: String, required: true }, // e.g., "Monday"
        start: { type: String, required: true }, // e.g., "14:00"
        end: { type: String, required: true }, // e.g., "16:00"
      }
    ], 
    default: []
  }, // Free time for this planner
  currentLocation: { 
    type: String, 
    default: '' 
  }, // Location for this planner
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Planner', plannerSchema);
