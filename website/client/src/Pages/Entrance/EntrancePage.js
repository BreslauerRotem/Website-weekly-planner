import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EntrancePage.css';

function EntrancePage() {
  const navigate = useNavigate();

  return (
    <div className="entrance-container">
      <h1 className="entrance-title">Welcome to the Weekly Planner!</h1>
      <button onClick={() => navigate('/login')} className="entrance-button">Log In</button>
      <button onClick={() => navigate('/signup')} className="entrance-button">Sign Up</button>
    </div>
  );
}

export default EntrancePage;
