import React, { useState } from 'react';
import './SignUpPage.css';

function SignUpPage() {
  // States for each input field
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Simple validation and processing logic here
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Submitted with Email:', email, 'Username:', username, 'Password:', password);
    // Here you would typically handle the data, e.g., sending it to a backend server
  };

  return (
    <div className="SignUp-page">
      <h1 className="SignUp-title">Sign Up</h1>
      <form className="SignUp-form" onSubmit={handleSubmit}>
        <label className="SignUp-label">
          Mail:
          <input type="email" name="email" className="SignUp-input" value={email} onChange={handleChange} />
        </label>
        <label className="SignUp-label">
          Username:
          <input type="text" name="username" className="SignUp-input" value={username} onChange={handleChange} />
        </label>
        <label className="SignUp-label">
          Pass:
          <input type="password" name="password" className="SignUp-input" value={password} onChange={handleChange} />
        </label>
        <label className="SignUp-label">
          Again:
          <input type="password" name="confirmPassword" className="SignUp-input" value={confirmPassword} onChange={handleChange} />
        </label>
        <button type="submit" className="SignUp-button">Create</button>
      </form>
    </div>
  );
}

export default SignUpPage;
