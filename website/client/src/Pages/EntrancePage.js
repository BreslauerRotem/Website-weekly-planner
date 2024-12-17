import React from 'react';
import './EntrancePage.css';

function EntrancePage({ onLogIn, onSignUp }) { // Include onSignUp prop
  return (
    <div className="entrance-container">
      <h1 className="entrance-title">Create your personal Weekly Planner now!</h1>
      <button className="entrance-button" onClick={onLogIn}>Log In</button>
      <button className="entrance-button" onClick={onSignUp}>Sign Up</button> // Attach onClick handler for sign up
    </div>
  );
}

export default EntrancePage;
