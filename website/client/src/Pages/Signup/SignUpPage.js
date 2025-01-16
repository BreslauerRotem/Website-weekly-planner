import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './SignUpPage.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    if (!email || !username || !password || !confirmPassword) {
      setErrorMessage('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      // Send user data to the server
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          hobbies: ['reading', 'swimming'], // Example hobbies
          freeTime: [
            { day: 'Monday', start: '14:00', end: '16:00' },
            { day: 'Wednesday', start: '10:00', end: '12:00' },
          ],
          currentLocation: '123 Main St, New York, NY 10001, USA', // Example location
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        setErrorMessage('');
        navigate('/hobbies'); // Navigate to the next page
      } else {
        setErrorMessage(data.message || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="SignUp-page">
      <h1 className="SignUp-title">Sign Up</h1>
      <form className="SignUp-form" onSubmit={handleSubmit}>
        {/* Email Input */}
        <label className="SignUp-label">
          Email:
          <input
            type="email"
            name="email"
            className="SignUp-input"
            value={email}
            onChange={handleChange}
            required
          />
        </label>

        {/* Username Input */}
        <label className="SignUp-label">
          Username:
          <input
            type="text"
            name="username"
            className="SignUp-input"
            value={username}
            onChange={handleChange}
            required
          />
        </label>

        {/* Password Input */}
        <label className="SignUp-label">
          Password:
          <input
            type="password"
            name="password"
            className="SignUp-input"
            value={password}
            onChange={handleChange}
            required
          />
        </label>

        {/* Confirm Password Input */}
        <label className="SignUp-label">
          Verify Password:
          <input
            type="password"
            name="confirmPassword"
            className="SignUp-input"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        {/* Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Submit Button */}
        <button type="submit" className="SignUp-button">Create</button>
      </form>
    </div>
  );
}

export default SignUpPage;
