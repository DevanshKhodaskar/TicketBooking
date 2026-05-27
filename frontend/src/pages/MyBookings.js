import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import './MyBookings.css';

const getTrainNumber = (booking) => booking.train?.trainNo ?? booking.train?.train_no ?? booking.trainNo ?? booking.train_no;
const getSeatNumber = (booking) => booking.seat?.seatNumber ?? booking.seat?.seat_number ?? booking.seatNumber ?? booking.seat_number;

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const fetchBookings = useCallback(async () => {
    const userId = user?.userId ?? user?.user_id;

    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/tickets/user/${userId}`);
      setBookings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      await api.delete(`/tickets/${ticketId}`);
      setBookings(bookings.filter(booking => booking.ticketId !== ticketId));
      alert('Ticket cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ticket');
    }
  };

  if (loading) {
    return (
      <div className="my-bookings">
        <h1>My Bookings</h1>
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any tickets yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.ticketId} className="booking-card">
              <div className="booking-header">
                <h3>Ticket ID: {booking.ticketId}</h3>
                <span className={`status ${booking.ticketStatus?.toLowerCase() || 'booked'}`}>
                  {booking.ticketStatus || 'BOOKED'}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Train:</span>
                  <span className="value">{getTrainNumber(booking)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Route:</span>
                  <span className="value">{booking.source} → {booking.destination}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(booking.dateOfTravel).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Seat:</span>
                  <span className="value">{getSeatNumber(booking)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Booked on:</span>
                  <span className="value">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {booking.ticketStatus === 'BOOKED' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(booking.ticketId)}
                >
                  Cancel Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
