import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Home.css';

function Home() {
  const { user } = useAuthStore();

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <span className="hero-badge">✨ Premium Train Booking Platform</span>
          <h1>Your Journey Starts Here</h1>
          <p>Book train tickets with confidence. Fast, secure, and hassle-free travel solutions at your fingertips.</p>
          
          {user ? (
            <div className="hero-actions">
              <Link to="/search" className="btn btn-primary btn-large">
                <span className="btn-icon">🔍</span> Search Trains
              </Link>
              <Link to="/bookings" className="btn btn-secondary btn-large">
                <span className="btn-icon">📋</span> My Bookings
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                <span className="btn-icon">🚀</span> Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                <span className="btn-icon">🔑</span> Sign In
              </Link>
            </div>
          )}
        </div>
        <div className="hero-illustration">
          <div className="train-graphic">🚄</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">10M+</div>
          <div className="stat-label">Happy Travelers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">500+</div>
          <div className="stat-label">Train Routes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Customer Support</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="features-header">
          <h2>Why Choose Our Platform?</h2>
          <p>Experience the best in train ticket booking with our innovative features</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🚂</div>
            </div>
            <h3>Easy Booking</h3>
            <p>Book your tickets in just a few clicks with our intuitive interface</p>
            <div className="feature-dot"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">💳</div>
            </div>
            <h3>Secure Payment</h3>
            <p>Industry-leading encryption for safe and secure transactions</p>
            <div className="feature-dot"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">📱</div>
            </div>
            <h3>Mobile Friendly</h3>
            <p>Access your bookings anytime, anywhere on any device</p>
            <div className="feature-dot"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">⚡</div>
            </div>
            <h3>Real-Time Updates</h3>
            <p>Get instant seat availability and booking confirmation</p>
            <div className="feature-dot"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🎯</div>
            </div>
            <h3>Best Prices</h3>
            <p>Get the best deals and exclusive offers on every booking</p>
            <div className="feature-dot"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🛡️</div>
            </div>
            <h3>Guaranteed Safety</h3>
            <p>Travel with confidence with our comprehensive protection</p>
            <div className="feature-dot"></div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="cta-section">
          <h2>Ready to Book Your Next Journey?</h2>
          <p>Join millions of satisfied passengers booking with us</p>
          <Link to="/signup" className="btn btn-primary btn-large btn-cta">
            Start Booking Now
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
