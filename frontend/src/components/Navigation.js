import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Navigation.css';

function Navigation() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🚂 Ticket Booking
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {user ? (
            <>
              <Link to="/search" className="nav-link">Search Trains</Link>
              <Link to="/bookings" className="nav-link">My Bookings</Link>
              <div className="nav-user">
                <span className="user-name">{user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
