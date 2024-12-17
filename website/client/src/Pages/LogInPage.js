import React from 'react';
import './LogInPage.css';

function LogInPage() {
  return (
    <div className="login-page">
      <h1 className="login-title">Log In</h1>
      <form className="login-form">
        <label className="login-label">
          Username:
          <input type="text" name="username" className="login-input" />
        </label>
        <label className="login-label">
          Password:
          <input type="password" name="password" className="login-input" />
        </label>
        <button type="submit" className="login-button">
          Continue
        </button>
      </form>
    </div>
  );
}

export default LogInPage;
