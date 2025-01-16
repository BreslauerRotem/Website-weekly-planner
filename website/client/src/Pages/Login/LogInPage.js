import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './LogInPage.css';

function LogInPage() {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const navigate = useNavigate(); // React Router hook for navigation

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation: Ensure fields are not empty
    if (!username || !password) {
      setErrorMessage('Both username and password are required!');
      return;
    }

    try {
      // Make a POST request to the login endpoint
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        console.log('Login successful:', data.message);
        setErrorMessage(''); // Clear error message

        // Store user data in localStorage (username and hobbies)
        localStorage.setItem('username', username);
        localStorage.setItem('hobbies', JSON.stringify(data.user.hobbies)); // Store hobbies as a stringified array

        navigate('/hobbies'); // Navigate to hobbies page or dashboard
      } else {
        // Handle server error messages
        setErrorMessage(data.message || 'Invalid username or password!');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('Something went wrong. Please try again later.');
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
            required
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
            required
          />
        </label>

        {/* Submit Button */}
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>

      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default LogInPage;
