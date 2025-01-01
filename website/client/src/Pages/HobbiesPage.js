import React, { useState } from 'react';
import './HobbiesPage.css';


function HobbiesPage() {
  const [selectedHobbies, setSelectedHobbies] = useState([]);

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

  const toggleHobby = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
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
      <button className="schedule-button">When can I do it?</button>
    </div>
  );
}

export default HobbiesPage;
