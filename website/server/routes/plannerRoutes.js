const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getCoordinatesForLocation, fetchNearbyPlaces } = require('../services/googleMapsService'); // Google Maps service

router.get('/generate-recommendations', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    // Fetch user data
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentLocation, hobbies, freeTime } = user;

    if (!currentLocation || hobbies.length === 0 || freeTime.length === 0) {
      return res.status(400).json({ message: 'Incomplete user data.' });
    }

    // Convert location to coordinates
    const coordinates = await getCoordinatesForLocation(currentLocation);

    const results = [];

    // Distribute hobbies across time slots
    const shuffledHobbies = [...hobbies].sort(() => Math.random() - 0.5); // Shuffle hobbies
    let hobbyIndex = 0; // To iterate through hobbies

    for (const timeSlot of freeTime) {
      const { day, start, end } = timeSlot;

      // Pick the next hobby and loop around if needed
      const selectedHobby = shuffledHobbies[hobbyIndex];
      hobbyIndex = (hobbyIndex + 1) % shuffledHobbies.length; // Cycle through hobbies

      // Fetch places for the selected hobby
      const places = await fetchNearbyPlaces(coordinates, selectedHobby, 5000);

      // Pick the top 3 results
      const recommendations = places.slice(0, 3).map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 'N/A',
        googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      }));

      // Add the recommendations to the time slot
      results.push({
        timeSlot: `${day} ${start}-${end}`,
        hobby: selectedHobby, // Include the hobby for context
        recommendations,
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error generating recommendations:', error.message);
    res.status(500).json({ message: 'Error generating recommendations.' });
  }
});

module.exports = router;
