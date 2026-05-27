import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchTrains from './pages/SearchTrains';
import MyBookings from './pages/MyBookings';
import './App.css';

function App() {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/" /> : <Signup />} 
            />
            <Route 
              path="/search" 
              element={user ? <SearchTrains /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/bookings" 
              element={user ? <MyBookings /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
