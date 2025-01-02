import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntrancePage from './Pages/Entrance/EntrancePage';
import LogInPage from './Pages/Login/LogInPage';
import SignUpPage from './Pages/Signup/SignUpPage';
import FreeTimePage from './Pages/FreeTime/FreeTimePage';
import ResultsPage from './Pages/Results/ResultsPage'
import './App.css';
import HobbiesPage from './Pages/Hobbies/HobbiesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EntrancePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/hobbies" element={<HobbiesPage/>} />
          <Route path="/freetime" element={<FreeTimePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import {Route, Router, Routes,} from "react-router-dom";
// import EntrancePage from './Pages/Entrance/EntrancePage';
// import LogInPage from './Pages/Login/LogInPage';
// import SignUpPage from './Pages/Signup/SignUpPage';
// import FreeTimePage from './Pages/FreeTime/FreeTimePage';
// import './App.css';

// function App() {
//   <Router>
//     <div className="App">
//       <Routes>
//         <Route path= "/" element={<EntrancePage />} />
//         <Route path= "/login" element={<LogInPage />} />
//         <Route path= "/signup" element={<SignUpPage />} />
//         <Route path= "/freetime" element={<FreeTimePage />} />
//         <Route path="*" element={<h1>404 - Page Not Found</h1>} />
//       </Routes>
//     </div>
//   </Router>
//   }

//   export default App;
  
  // const [currentPage, setCurrentPage] = useState('entrance'); 
  // const onLogIn = () => setCurrentPage('login');
  // const onSignUp = () => setCurrentPage('signup');
  // const onLoginSuccess = () => setCurrentPage('freetime'); // Navigate to FreeTime
  // const onSignUpSuccess = () => setCurrentPage('freetime'); // Navigate to FreeTime

  // return (
  //   <div className="App">
  //     {currentPage === 'entrance' && (
  //       <EntrancePage onLogIn={onLogIn} onSignUp={onSignUp} />
  //     )}
  //     {currentPage === 'login' && (
  //       <LogInPage onLoginSuccess={onLoginSuccess} />
  //     )}
  //     {currentPage === 'signup' && (
  //       <SignUpPage onSignUpSuccess={onSignUpSuccess} />
  //     )}
  //     {currentPage === 'freetime' && (
  //       <FreeTimePage />
  //     )}
  //   </div>
  // );
