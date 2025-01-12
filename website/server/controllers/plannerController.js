const Planner = require('../models/Planner');
const User = require('../models/user');

// Controller to create a new planner
const createPlanner = async (req, res) => {
  try {
    const { userId, hobbies, freeTime, currentLocation } = req.body;

    // Create a new planner document
    const planner = await Planner.create({
      user: userId,
      hobbies,
      freeTime,
      currentLocation,
    });

    // Add the planner's reference to the user's planners array
    await User.findByIdAndUpdate(userId, { $push: { planners: planner._id } });

    res.status(201).json({ message: 'Planner created successfully', planner });
  } catch (error) {
    console.error('Error creating planner:', error);
    res.status(500).json({ message: 'Failed to create planner' });
  }
};

// Controller to get all planners for a specific user
const getUserPlanners = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and populate the planners field
    const user = await User.findById(userId).populate('planners');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.planners);
  } catch (error) {
    console.error('Error fetching planners:', error);
    res.status(500).json({ message: 'Failed to fetch planners' });
  }
};

module.exports = { createPlanner, getUserPlanners };
