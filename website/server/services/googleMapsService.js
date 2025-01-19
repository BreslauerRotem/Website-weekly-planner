const axios = require('axios');

// Use your environment variable for the API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Convert a user-readable location (e.g., a city name) into "lat,lng" coordinates.
 * @param {string} location - The city name (or address) to geocode.
 * @returns {Promise<string>} - A string in the format "latitude,longitude".
 */
async function getCoordinatesForLocation(location) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    location
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // If no results, throw an error
    if (!data.results || data.results.length === 0) {
      throw new Error('No results found for location');
    }

    // Extract the lat/lng from the first result
    const coordinates = data.results[0].geometry.location;
    return `${coordinates.lat},${coordinates.lng}`;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
}

/**
 * Fetch places near a given location that match a keyword (e.g., hobby).
 * @param {string} location - A string in "lat,lng" format.
 * @param {string} keyword - The search keyword (e.g., "gym", "museum").
 * @param {number} [radius=5000] - The search radius in meters.
 * @returns {Promise<Array>} - An array of place objects from the Google Places API.
 */
async function fetchNearbyPlaces(location, keyword, radius = 5000) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.results; // Return the array of places
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
}

module.exports = {
  getCoordinatesForLocation,
  fetchNearbyPlaces,
};
