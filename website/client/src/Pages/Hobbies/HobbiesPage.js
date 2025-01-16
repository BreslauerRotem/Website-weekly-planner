import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import './HobbiesPage.css';

function HobbiesPage() {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // React Router hook for navigation

  const hobbies = [
    { id: 1, name: 'Yoga', icon: '🧘' },
    { id: 2, name: 'Basketball', icon: '🏀' },
    { id: 3, name: 'Reading', icon: '📚' },
    { id: 4, name: 'Swimming', icon: '🏊' },
    { id: 5, name: 'Pilates', icon: '🧘‍♀️' },
    { id: 6, name: 'Ceramics', icon: '🏺' },
    { id: 7, name: 'Movie', icon: '🎥' },
    { id: 8, name: 'Tennis', icon: '🎾' },
  ];

  useEffect(() => {
    // Retrieve hobbies from localStorage when the component mounts
    const storedHobbies = JSON.parse(localStorage.getItem('hobbies')) || [];
    setSelectedHobbies(storedHobbies); // Set the hobbies to the state when the page loads
  }, []);

  const toggleHobby = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  // Handle navigation when the button is clicked
  const handleScheduleClick = async () => {
    if (selectedHobbies.length === 0) {
      setErrorMessage('Please select at least one hobby to proceed.');
      return;
    }

    const username = localStorage.getItem('username'); // Get the username from localStorage

    if (!username) {
      setErrorMessage('Please log in first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/update-hobbies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Use the logged-in username
          hobbies: selectedHobbies,
        }),
      });

      if (response.ok) {
        console.log('Hobbies updated successfully!');
        setErrorMessage(''); // Clear error message
        navigate('/freetime'); // Navigate to free time page
      } else {
        console.error('Failed to update hobbies');
        setErrorMessage('Failed to update hobbies. Please try again.');
      }
    } catch (error) {
      console.error('Error updating hobbies:', error);
      setErrorMessage('Error occurred while updating hobbies.');
    }
  };

  return (
    <div className="hobbies-page">
      <h1 className="hobbies-title">My Hobbies</h1>
      <div className="hobbies-list">
        {hobbies.map((hobby) => (
          <button
            key={hobby.id}
            className={`hobby-button ${selectedHobbies.includes(hobby.name) ? 'selected' : ''}`}
            onClick={() => toggleHobby(hobby.name)}
          >
            <div className="hobby-icon">{hobby.icon}</div>
            <span className="hobby-name">{hobby.name}</span>
          </button>
        ))}
      </div>

      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="freetime-button" onClick={handleScheduleClick}>
        When can I do it?
      </button>
    </div>
  );
}

export default HobbiesPage;
