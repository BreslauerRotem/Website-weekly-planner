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
    console.log(`Fetching coordinates for location: ${location}`);
    const response = await axios.get(url);
    const data = response.data;

    // If no results, throw an error
    if (!data.results || data.results.length === 0) {
      console.error(`No results found for location: ${location}`);
      throw new Error('No results found for location');
    }

    // Extract the lat/lng from the first result
    const coordinates = data.results[0].geometry.location;
    console.log(`Coordinates for ${location}: ${coordinates.lat},${coordinates.lng}`);
    return `${coordinates.lat},${coordinates.lng}`;
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw error;
  }
}

/**
 * Fetch places near a given location that match a keyword (e.g., "gym", "library").
 * @param {string} location - A string in "lat,lng" format.
 * @param {string} keyword - The search keyword.
 * @param {number} [radius=5000] - The search radius in meters.
 * @returns {Promise<Array>} - An array of place objects from the Google Places API.
 */
async function fetchNearbyPlaces(location, keyword, radius = 5000) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${encodeURIComponent(
    keyword
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    console.log(`Fetching places near ${location} for keyword: ${keyword}, radius: ${radius}`);
    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
      console.error(
        `Google Places API error for location ${location}, keyword ${keyword}:`,
        response.data.error_message
      );
      return [];
    }

    console.log(
      `Found ${response.data.results.length} places near ${location} for keyword: ${keyword}`
    );
    return response.data.results; // Return the array of places
  } catch (error) {
    console.error('Error fetching nearby places:', error.message);
    throw error;
  }
}

/**
 * Map a user hobby to the actual search keyword for Google Places.
 * Adjust this as needed for your own hobbies.
 * @param {string} hobby
 * @returns {string}
 */
function mapHobbyToKeyword(hobby) {
  if (!hobby) return '';

  switch (hobby.toLowerCase()) {
    case 'swimming':
      return 'swimming pool';
    case 'basketball':
      return 'basketball court';
    case 'yoga':
      return 'yoga studio';
    case 'pilates':
      return 'pilates studio';
    case 'ceramics':
      return 'pottery studio';
    case 'movie':
      return 'cinema';
    case 'tennis':
      return 'tennis court';
    case 'cycling':
      return 'bike trail';
    case 'cooking':
      return 'cooking class';
    case 'painting':
      return 'art studio';
    case 'running':
      return 'running track';
    case 'chess':
      return 'chess club';
    case 'photography':
      return 'photography store';
    case 'hiking':
      return 'hiking trail';
    case 'surfing':
      return 'surfing beach';
    case 'dancing':
      return 'dance studio';
    case 'bowling':
      return 'bowling alley';
    case 'gym':
      return 'gym';

    default:
      return hobby;
  }
}


/**
 * Fetch places based on address instead of lat/lng.
 * @param {string} address - The user-provided address.
 * @param {string} hobby - The hobby to look for.
 * @param {number} radius - Search radius in meters.
 * @returns {Promise<Array>} - Array of place objects.
 */
async function fetchNearbyPlacesByAddress(address, hobby, radius = 5000) {
  try {
    // 1) Convert the hobby to a proper Google Places keyword:
    const keyword = mapHobbyToKeyword(hobby);

    // 2) Get the coordinates for the address
    const coordinates = await getCoordinatesForLocation(address);

    // 3) Fetch nearby places using those coordinates + mapped keyword
    const places = await fetchNearbyPlaces(coordinates, keyword, radius);

    console.log(`Places found for address "${address}" and hobby "${hobby}" (keyword: "${keyword}"):`);
    return places;
  } catch (error) {
    console.error(
      `Error fetching nearby places for address "${address}" and hobby "${hobby}":`,
      error.message
    );
    throw error;
  }
}

module.exports = {
  getCoordinatesForLocation,
  fetchNearbyPlaces,
  fetchNearbyPlacesByAddress,
};
