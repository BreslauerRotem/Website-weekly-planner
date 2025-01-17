import React, { useState, useEffect, useMemo  } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreeTimePage.css';

function FreeTime() {
  const daysOfWeek = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);  const navigate = useNavigate();

  const [timeSlots, setTimeSlots] = useState({});
  const [currentLocation, setCurrentLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedTimeSlots = JSON.parse(localStorage.getItem('freeTime')) || {};
    const storedLocation = localStorage.getItem('currentLocation') || '';
    const defaultSlots = daysOfWeek.reduce((acc, day) => {
      acc[day] = storedTimeSlots[day] || [{ start: '', end: '' }];
      return acc;
    }, {});
    setTimeSlots(defaultSlots);
    setCurrentLocation(storedLocation);
  }, [daysOfWeek]); // Add daysOfWeek to the dependency array
  

// Remove this unused function
const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);



const handleTimeChange = (day, index, field, value) => {
  // Update the state without immediate validation
  const updatedSlots = [...timeSlots[day]];
  updatedSlots[index][field] = value;

  setTimeSlots({ ...timeSlots, [day]: updatedSlots });
  setErrorMessage(''); // Clear any previous error messages while typing
};

const handleBlur = (day, index, field) => {
  // Validate the time format only when the user leaves the input field
  const time = timeSlots[day][index][field];
  if (!isValidTime(time)) {
    setErrorMessage('Invalid time format. Please use HH:MM format.');
    return;
  }
  setErrorMessage(''); // Clear error message if valid
};


  const handleLocationChange = (value) => {
    setCurrentLocation(value);
  };

  const addSlot = (day) => {
    if ((timeSlots[day] || []).length < 2) {
      setTimeSlots({
        ...timeSlots,
        [day]: [...(timeSlots[day] || []), { start: '', end: '' }],
      });
    }
  };

  const toggleSlot = (day, index) => {
    const updatedSlots = timeSlots[day]?.filter((_, i) => i !== index) || [];
    setTimeSlots({ ...timeSlots, [day]: updatedSlots.length ? updatedSlots : [{ start: '', end: '' }] });
  };

  const handleSaveClick = async () => {
    if (!currentLocation.trim()) {
      setErrorMessage('Please enter your current location.');
      return;
    }
  
    const username = localStorage.getItem('username');
    if (!username) {
      setErrorMessage('Please log in first.');
      return;
    }
  
    // Transform timeSlots into the desired format
    const formattedFreeTime = [];
    Object.keys(timeSlots).forEach((day) => {
      (timeSlots[day] || []).forEach((slot) => {
        if (slot.start && slot.end) {
          formattedFreeTime.push({
            day,
            start: slot.start,
            end: slot.end,
          });
        }
      });
    });
  
    try {
      const response = await fetch('http://localhost:5001/update-free-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          freeTime: formattedFreeTime, // Send formatted freeTime
          currentLocation,
        }),
      });
  
      if (response.ok) {
        console.log('Free time and location updated successfully!');
        localStorage.setItem('freeTime', JSON.stringify(formattedFreeTime));
        localStorage.setItem('currentLocation', currentLocation);
        setErrorMessage('');
        navigate('/results');
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
            {(timeSlots[day] || []).map((slot, index) => (
              <div key={index} className="time-slot">
                <input
                  type="text"
                  placeholder="Start (HH:MM)"
                  value={slot.start}
                  onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                  onBlur={() => handleBlur(day, index, 'start')}
                />
                <input
                  type="text"
                  placeholder="End (HH:MM)"
                  value={slot.end}
                  onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                  onBlur={() => handleBlur(day, index, 'end')}
                />
                <button
                  className="remove-slot-button"
                  onClick={() => toggleSlot(day, index)}
                >
                  Remove
                </button>
              </div>
            ))}
            {timeSlots[day]?.length < 2 && (
              <button className="add-slot-button" onClick={() => addSlot(day)}>+</button>
            )}
          </div>
        ))}
      </div>
  
      <div className="location-section">
        <h3 className="location-title">Current Location</h3>
        <input
          type="text"
          placeholder="Enter your address"
          value={currentLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>
  
      {errorMessage && <p className="error-message">{errorMessage}</p>}
  
      <button className="save-button" onClick={handleSaveClick}>
        Save and Continue
      </button>
    </div>
  );
}

export default FreeTime;
