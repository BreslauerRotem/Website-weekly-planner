import React, { useState } from 'react';
import EntrancePage from './Pages/EntrancePage';
import LogInPage from './Pages/LogInPage';
import SignUpPage from './Pages/SignUpPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('entrance'); // State to control which page to show

  // Handler for login navigation
  const onLogIn = () => {
    console.log('Navigating to login');
    setCurrentPage('login');
  };

  // Handler for signup navigation
  const onSignUp = () => {
    console.log('Navigating to signup');
    setCurrentPage('signup');
  };

  return (
    <div className="App">
      {currentPage === 'entrance' && (
        <EntrancePage 
          onLogIn={onLogIn} // Pass the login handler
          onSignUp={onSignUp} // Pass the signup handler
        />
      )}
      {currentPage === 'login' && (
        <LogInPage />
      )}
      {currentPage === 'signup' && (
        <SignUpPage />
      )}
    </div>
  );
}

export default App;
