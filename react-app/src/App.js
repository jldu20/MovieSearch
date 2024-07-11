import React from 'react';
import './App.css';
import LandingPage from './pages/LandingPage.js'
import Movies from './pages/Movies.js'
import TVShows from './pages/TVShows.js'
import Results from './pages/Results.js'
import Account from './pages/Account.js'
import UserLoginPage from './pages/Login.js'
import Register from './pages/Register.js'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

//Function to render the entire app, handling routing to each page.
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
          <Route exact path="/movies" element={<Movies/>} />
          <Route exact path="/tv-shows" element={<TVShows/>} />
          <Route exact path="/results" element={<Results/>} />
          <Route exact path="/profile" element={<Account/>} />
          <Route exact path="/login" element={<UserLoginPage/>} />
          <Route exact path="/register" element={<Register/>} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
