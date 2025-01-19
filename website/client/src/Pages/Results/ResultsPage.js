import React, { useState, useEffect } from 'react';
import './ResultsPage.css';

function ResultsPage() {
  // 1) Retrieve the username from localStorage
  const [username] = useState(() => localStorage.getItem('username') || '');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2) Fetch recommendations on mount (if we have a username)
  useEffect(() => {
    if (username) {
      loadRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Make sure your server is running on localhost:5001 
      // and the route matches your plannerRoutes
      const response = await fetch(
        `http://localhost:5001/api/planner/generate-recommendations?username=${username}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Your Personalized Activity Recommendations</h1>

      {/* Loading indicator */}
      {loading && <p className="loading-message">Loading activities...</p>}

      {/* Show recommendations if available */}
      {!loading && recommendations.length > 0 && (
        recommendations.map((slot, idx) => (
          <div key={idx} className="slot-container">
            <h2 className="slot-title">{slot.timeSlot}</h2>
            <div className="activities-list">
              {slot.recommendations.map((place, i) => (
                <div key={i} className="activity-card">
                  <h3 className="activity-name">{place.name}</h3>
                  <p className="activity-hobby">Address: {place.address}</p>
                  <p className="activity-hobby">Rating: {place.rating}</p>
                  <a
                    href={place.googleMapsLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Google Maps
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* If no recommendations (or user not found) */}
      {!loading && recommendations.length === 0 && (
        <p className="error-message">
          No recommendations found. Please add your free time and hobbies!
        </p>
      )}
    </div>
  );
}

export default ResultsPage;
