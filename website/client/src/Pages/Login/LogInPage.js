import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './LogInPage.css';

function LogInPage() {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const navigate = useNavigate(); // React Router hook for navigation

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Simulated authentication logic
    if (username === 'admin' && password === 'password') { // Replace with real authentication logic
      console.log('User logged in successfully');
      setErrorMessage(''); // Clear error message
      navigate('/hobbies'); // Navigate to Hobbies page
    } else {
      console.error('Login failed');
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Username Input */}
        <label className="login-label">
          Username:
          <input 
            type="text" 
            name="username" 
            className="login-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        {/* Password Input */}
        <label className="login-label">
          Password:
          <input 
            type="password" 
            name="password" 
            className="login-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* Submit Button */}
        <button type="submit" className="login-button">
          Continue
        </button>
      </form>

      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default LogInPage;
