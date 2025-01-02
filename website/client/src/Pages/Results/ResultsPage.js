import React, { useState, useEffect } from 'react';
import './ResultsPage.css';

// Mock Google Maps API fetch (replace with real API call later)
const fetchActivities = async (timeSlot, hobbies, pageToken = null) => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        results: [
          { id: 1, name: `Activity 1 for ${timeSlot.start}-${timeSlot.end}`, hobby: hobbies[0] },
          { id: 2, name: `Activity 2 for ${timeSlot.start}-${timeSlot.end}`, hobby: hobbies[1] },
        ],
        nextPageToken: pageToken ? null : 'next-page-token', // Mock pagination
      });
    }, 1000);
  });
};

function ResultsPage() {
  const [timeSlots, setTimeSlots] = useState([
    { day: 'Monday', start: '10:00', end: '12:00' },
    { day: 'Tuesday', start: '', end: '' }, // Invalid slot
    { day: 'Wednesday', start: '14:00', end: '16:00' },
  ]); // Mocked time slots (replace with props/state later)

  const [hobbies, setHobbies] = useState(['Sports', 'Art']); // Mocked hobbies (replace with props/state later)

  const [activityResults, setActivityResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  // Helper function to check if a time slot is valid
  const isValidSlot = (slot) => slot.start && slot.end;

  // Load activities for valid slots
  const loadActivities = async () => {
    setLoading(true);
    const newResults = { ...activityResults };

    for (const slot of timeSlots) {
      if (isValidSlot(slot) && !newResults[slot.day]) {
        newResults[slot.day] = [];
        const apiResponse = await fetchActivities(slot, hobbies);
        newResults[slot.day] = [...newResults[slot.day], ...apiResponse.results];
      }
    }

    setActivityResults(newResults);
    setLoading(false);
  };

  // Load more activities for a specific slot
  const loadMoreActivities = async (slot) => {
    if (!isValidSlot(slot)) return; // Prevent load more on invalid slots
    setLoading(true);
    const apiResponse = await fetchActivities(slot, hobbies, 'next-page-token');
    setActivityResults((prevResults) => ({
      ...prevResults,
      [slot.day]: [...(prevResults[slot.day] || []), ...apiResponse.results],
    }));
    setLoading(false);
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Your Personalized Activity Recommendations</h1>
      {loading && <p className="loading-message">Loading activities...</p>}
      
      {/* Render only valid slots */}
      {timeSlots
        .filter(isValidSlot)
        .map((slot, index) => (
          <div key={index} className="slot-container">
            <h2 className="slot-title">
              {slot.day}: {slot.start} - {slot.end}
            </h2>
            <div className="activities-list">
              {activityResults[slot.day]?.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <h3 className="activity-name">{activity.name}</h3>
                  <p className="activity-hobby">Related to: {activity.hobby}</p>
                </div>
              )) || <p>No activities found yet.</p>}
            </div>
            <button
              className="load-more-button"
              onClick={() => loadMoreActivities(slot)}
            >
              Load More
            </button>
          </div>
        ))}

      {/* Display message if no valid slots */}
      {timeSlots.every((slot) => !isValidSlot(slot)) && (
        <p className="error-message">You have not entered valid time slots. Please go back and add your free time!</p>
      )}
    </div>
  );
}

export default ResultsPage;
