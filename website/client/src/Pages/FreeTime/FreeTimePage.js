import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import './FreeTimePage.css';

function FreeTime() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const navigate = useNavigate(); // Hook for navigation

  const [timeSlots, setTimeSlots] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [{ start: '', end: '' }] }), {})
  );

  const [currentLocation, setCurrentLocation] = useState(''); // State for location as a string (address)
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  // Validate time format (24-hour format)
  const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  // Handle input change for time slots
  const handleTimeChange = (day, index, field, value) => {
    const updatedSlots = [...timeSlots[day]];
    updatedSlots[index][field] = value;

    setTimeSlots({ ...timeSlots, [day]: updatedSlots });
    setErrorMessage(''); // Clear error message when typing
  };

  // Handle input change for location
  const handleLocationChange = (value) => {
    setCurrentLocation(value);
  };

  // Add another time slot
  const addSlot = (day) => {
    if (timeSlots[day].length < 2) {
      setTimeSlots({
        ...timeSlots,
        [day]: [...timeSlots[day], { start: '', end: '' }],
      });
    }
  };

  // Check if at least one slot is valid
  const hasValidSlot = () => {
    let isValid = false;
    for (const day in timeSlots) {
      for (const slot of timeSlots[day]) {
        if (
          isValidTime(slot.start) &&
          isValidTime(slot.end) &&
          slot.start < slot.end // Ensure start time is earlier than end time
        ) {
          isValid = true;
          break;
        }
      }
    }
    return isValid; // Return true if any valid slot is found
  };

  // Validate and Navigate
  const handleContinue = async () => {
    // Check if location is entered
    if (!currentLocation.trim()) {
      setErrorMessage('Please enter your current location.');
      return;
    }
  
    // Check if at least one valid slot is entered
    if (!hasValidSlot()) {
      setErrorMessage('Please enter at least one valid time slot.');
      return;
    }
  
    try {
      const username = localStorage.getItem('username'); // Or another method of fetching the logged-in user's data
  
      if (!username) {
        setErrorMessage('Please log in first.');
        return;
      }
  
      // Send free time and location to the server
      const response = await fetch('http://localhost:5001/update-free-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Send the logged-in user's username
          freeTime: timeSlots, // Send the time slots array
          currentLocation: currentLocation, // Send the current location as well
        }),
      });
  
      if (response.ok) {
        console.log('Free time updated successfully!');
        navigate('/results'); // Proceed to the results page
      } else {
        console.error('Failed to update free time');
        setErrorMessage('Failed to update free time. Please try again.');
      }
    } catch (error) {
      console.error('Error updating free time:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="freetime-container">
      <h1 className="freetime-title">My Free Time</h1>
      <div className="days-container">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-section">
            <h3 className="day-title">{day}</h3>
            {timeSlots[day].map((slot, index) => (
              <div key={index} className="time-slot">
                <input
                  type="text"
                  placeholder="Start (HH:MM)"
                  value={slot.start}
                  onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="End (HH:MM)"
                  value={slot.end}
                  onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                />
              </div>
            ))}
            {timeSlots[day].length < 2 && (
              <button className="add-slot-button" onClick={() => addSlot(day)}>+</button>
            )}
          </div>
        ))}
      </div>

      {/* Current Location Section */}
      <div className="location-section">
        <h3 className="location-title">Current Location</h3>
        <input
          type="text"
          placeholder="Enter your address"
          value={currentLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>

      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Continue Button */}
      <button className="validate-button" onClick={handleContinue}>
        See My Personal Weekly Planner
      </button>
    </div>
  );
}

export default FreeTime;
