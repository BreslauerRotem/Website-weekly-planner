const axios = require('axios');

// Use your environment variable for the API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Convert a user-readable location (e.g., a city name or address) into "lat,lng" coordinates.
 * @param {string} location - The city name (or address) to geocode.
 * @returns {Promise<string>} - A string in the format "latitude,longitude".
 */
async function getCoordinatesForLocation(location) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    location
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    console.log(`Fetching coordinates for location: ${location}`); // Log the location being geocoded
    const response = await axios.get(url);
    const data = response.data;

    // If no results, throw an error
    if (!data.results || data.results.length === 0) {
      console.error(`No results found for location: ${location}`); // Log error for no results
      throw new Error('No results found for location');
    }

    // Extract the lat/lng from the first result
    const coordinates = data.results[0].geometry.location;
    console.log(`Coordinates for ${location}: ${coordinates.lat},${coordinates.lng}`); // Log the coordinates
    return `${coordinates.lat},${coordinates.lng}`;
  } catch (error) {
    console.error('Error fetching coordinates:', error.message); // Log detailed error
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
    console.log(`Fetching places near ${location} for keyword: ${keyword}, radius: ${radius}`); // Log details of the search
    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
      console.error(
        `Google Places API error for location ${location}, keyword ${keyword}:`,
        response.data.error_message
      ); // Log API-specific errors
      return [];
    }

    console.log(
      `Found ${response.data.results.length} places near ${location} for keyword: ${keyword}`
    ); // Log number of places found
    return response.data.results; // Return the array of places
  } catch (error) {
    console.error('Error fetching nearby places:', error.message); // Log detailed error
    throw error;
  }
}

/**
 * Fetch places based on address instead of lat/lng.
 * @param {string} address - The user-provided address.
 * @param {string} keyword - The search keyword.
 * @param {number} radius - Search radius in meters.
 * @returns {Promise<Array>} - Array of place objects.
 */
async function fetchNearbyPlacesByAddress(address, keyword, radius = 5000) {
  try {
    // Get the coordinates for the address
    const coordinates = await getCoordinatesForLocation(address);

    // Fetch nearby places using those coordinates
    const places = await fetchNearbyPlaces(coordinates, keyword, radius);

    console.log(`Places found for address "${address}" and keyword "${keyword}":`, places); // Log found places
    return places;
  } catch (error) {
    console.error(
      `Error fetching nearby places for address "${address}" and keyword "${keyword}":`,
      error.message
    ); // Log error details
    throw error;
  }
}

module.exports = {
  getCoordinatesForLocation,
  fetchNearbyPlaces,
  fetchNearbyPlacesByAddress,
};
