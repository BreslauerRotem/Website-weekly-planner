/****************************************************
 * plannerRoutes.js
 ****************************************************/
const express = require('express');
const router = express.Router();

/** 
 * Existing Controller Functions
 * (Assuming you still need these for creating/getting planners)
 */
const { createPlanner, getUserPlanners } = require('../controllers/plannerController');

/**
 * Import your User model and the Google Maps service
 */
const User = require('../models/User');
const { getCoordinatesForLocation, fetchNearbyPlaces } = require('../services/googleMapsService');

/****************************************************
 * 1) Existing Planner Routes
 ****************************************************/
// Route to create a new planner
router.post('/', createPlanner);

// Route to get all planners for a user
router.get('/user/:userId', getUserPlanners);

/****************************************************
 * 2) New "Generate Recommendations" Route
 ****************************************************/
router.get('/generate-recommendations', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    // 1) Fetch user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2) Destructure user's stored data
    const { currentLocation, hobbies, freeTime } = user;

    // If user has incomplete data, return a 400
    if (!currentLocation || !hobbies || hobbies.length === 0 || !freeTime) {
      return res.status(400).json({ message: 'Incomplete user data.' });
    }

    // 3) Convert location (city name, etc.) to lat/lng using Google Geocoding
    const coordinates = await getCoordinatesForLocation(currentLocation);

    // Gather recommendations for each time slot
    const results = [];

    for (const timeSlot of freeTime) {
      const { day, start, end } = timeSlot;

      // Temporary array to store recommended places for this time slot
      const slotRecommendations = [];

      // For each hobby, fetch nearby places from Google
      for (const hobby of hobbies) {
        const places = await fetchNearbyPlaces(coordinates, hobby);

        // Just pick the first 3 places
        const top3 = places.slice(0, 3).map((place) => ({
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 'N/A',
          googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        }));

        // Combine results for all hobbies in this time slot
        slotRecommendations.push(...top3);
      }

      // Optionally limit combined results to 3
      const limitedRecommendations = slotRecommendations.slice(0, 3);

      // Store the final results in our "results" array
      results.push({
        timeSlot: `${day} ${start}-${end}`,
        recommendations: limitedRecommendations,
      });
    }

    // 4) Send the final array of recommendations back as JSON
    res.status(200).json(results);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

/****************************************************
 * 3) Export the Router
 ****************************************************/
module.exports = router;
