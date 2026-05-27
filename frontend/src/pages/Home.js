import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Home.css';

function Home() {
  const { user } = useAuthStore();

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Ticket Booking System</h1>
        <p>Book your train tickets easily and conveniently</p>
        
        {user ? (
          <div className="hero-actions">
            <Link to="/search" className="btn btn-primary btn-large">
              Search Trains
            </Link>
            <Link to="/bookings" className="btn btn-secondary btn-large">
              My Bookings
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Already have an account?
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <h2>Why choose us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚂</div>
            <h3>Easy Booking</h3>
            <p>Book your tickets in just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Safe and secure payment options</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access your bookings anytime, anywhere</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Reliable</h3>
            <p>Real-time seat availability updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
