import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!formData.name || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.name, formData.password);
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1>Login</h1>
        
        {(localError || error) && (
          <div className="alert alert-error">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
