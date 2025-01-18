import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreeTimePage.css';

function FreeTime() {
  const daysOfWeek = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
  const navigate = useNavigate();

  const [timeSlots, setTimeSlots] = useState({});
  const [currentLocation, setCurrentLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem('username');
      if (!username) {
        setErrorMessage('Please log in first.');
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5001/get-user-data?username=${username}`);
        if (response.ok) {
          const data = await response.json();
  
          // Populate timeSlots and location for returning users
          const defaultSlots = daysOfWeek.reduce((acc, day) => {
            const daySlots = data.freeTime
              .filter((slot) => slot.day === day)
              .map((slot) => ({ start: slot.start, end: slot.end }));
  
            // If no slots exist for a day, add an empty slot
            acc[day] = daySlots.length > 0 ? daySlots : [{ start: '', end: '' }];
            return acc;
          }, {});
  
          setTimeSlots(defaultSlots); // Populate the state with the processed data
          setCurrentLocation(data.currentLocation || ''); // Populate the location
        } else {
          console.error('Failed to fetch user data.');
          setTimeSlots(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [{ start: '', end: '' }] }), {}));
          setCurrentLocation('');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setTimeSlots(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [{ start: '', end: '' }] }), {}));
        setCurrentLocation('');
      }
    };
  
    fetchUserData();
  }, [daysOfWeek]);
  

  const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  const isStartBeforeEnd = (start, end) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    return startHour < endHour || (startHour === endHour && startMinute < endMinute);
  };

  const handleTimeChange = (day, index, field, value) => {
    const updatedSlots = [...timeSlots[day]];
    updatedSlots[index][field] = value;

    setTimeSlots({ ...timeSlots, [day]: updatedSlots });
    setErrorMessage('');
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

    // Check if there is at least one valid time slot across all days
    const hasValidSlot = Object.keys(timeSlots).some((day) =>
      timeSlots[day].some(
        (slot) =>
          isValidTime(slot.start) &&
          isValidTime(slot.end) &&
          isStartBeforeEnd(slot.start, slot.end)
      )
    );

    if (!hasValidSlot) {
      setErrorMessage('Please provide at least one valid time slot.');
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
          freeTime: formattedFreeTime,
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
                />
                <input
                  type="text"
                  placeholder="End (HH:MM)"
                  value={slot.end}
                  onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
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
