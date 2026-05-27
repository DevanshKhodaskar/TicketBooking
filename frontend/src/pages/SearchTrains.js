import React, { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import './SearchTrains.css';

const normalizeStationName = (stationName = '') => stationName.trim().toLowerCase();

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatJourneyDate = (date) => {
  if (!date) {
    return 'Any date';
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(parsedDate);
};

const formatTime = (time) => (time ? time.slice(0, 5) : 'N/A');

const normalizeStation = (station = {}) => ({
  id: station.id,
  stationName: station.stationName ?? station.station_name ?? '',
  stationSequence: station.stationSequence ?? station.station_sequence ?? 0,
  arrivalTime: station.arrivalTime ?? station.arrival_time ?? '',
  departureTime: station.departureTime ?? station.departure_time ?? '',
});

const normalizeTrain = (train = {}) => ({
  trainId: train.trainId ?? train.train_id ?? '',
  trainNo: train.trainNo ?? train.train_no ?? 'Train unavailable',
  totalSeats: train.totalSeats ?? train.total_seats ?? 0,
  availableSeats: train.availableSeats ?? train.available_seats ?? 0,
  stations: Array.isArray(train.stations) ? train.stations.map(normalizeStation) : [],
});

const getRouteDetails = (train, source, destination) => {
  const stations = train.stations || [];
  const sourceName = normalizeStationName(source);
  const destinationName = normalizeStationName(destination);

  const sourceIndex = stations.findIndex(
    (station) => normalizeStationName(station.stationName) === sourceName
  );
  const destinationIndex = stations.findIndex(
    (station, index) =>
      index > sourceIndex && normalizeStationName(station.stationName) === destinationName
  );

  if (sourceIndex === -1 || destinationIndex === -1) {
    return {
      sourceStation: null,
      destinationStation: null,
      stopsBetween: null,
    };
  }

  return {
    sourceStation: stations[sourceIndex],
    destinationStation: stations[destinationIndex],
    stopsBetween: destinationIndex - sourceIndex - 1,
  };
};

function SearchTrains() {
  const todayDate = getTodayDate();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    date: '',
  });
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const { user } = useAuthStore();
  const resultLabel = `${trains.length} train${trains.length === 1 ? '' : 's'} found`;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const source = filters.source.trim();
    const destination = filters.destination.trim();
    const date = filters.date;

    if (!source || !destination || !date) {
      setError('Please enter source, destination, and date');
      setTrains([]);
      return;
    }

    if (date < todayDate) {
      setError('Please select today or a future travel date');
      setTrains([]);
      return;
    }

    setLoading(true);
    setError('');
    setSelectedTrain(null);

    try {
      const response = await api.get('/trains/search', {
        params: {
          source,
          destination,
          date,
        }
      });
      const normalizedTrains = (response.data.data || []).map(normalizeTrain);
      setTrains(normalizedTrains);
      if (normalizedTrains.length === 0) {
        setError('No trains found for this route');
      }
    } catch (err) {
      setTrains([]);
      setError(err.response?.data?.message || 'Failed to search trains');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!(user?.userId ?? user?.user_id)) {
      setBookingError('Please log in again to continue booking');
      return;
    }

    if (!filters.date) {
      setBookingError('Please select a travel date before booking');
      return;
    }

    if (filters.date < todayDate) {
      setBookingError('You cannot book tickets for a past travel date');
      return;
    }

    try {
      const bookingData = {
        userId: user?.userId ?? user?.user_id,
        trainId: selectedTrain.trainId,
        source: filters.source.trim(),
        destination: filters.destination.trim(),
        dateOfTravel: filters.date,
      };

      const response = await api.post('/tickets/book', bookingData);
      const bookedSeatNumber = response.data?.data?.seat?.seatNumber ?? response.data?.data?.seat?.seat_number;

      setBookingError('');
      setSelectedTrain(null);
      alert(
        bookedSeatNumber
          ? `Ticket booked successfully! Seat ${bookedSeatNumber} has been assigned.`
          : 'Ticket booked successfully!'
      );
      setTrains([]);
      setFilters({ source: '', destination: '', date: '' });
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="search-trains">
      <h1>Search Trains</h1>

      <div className="search-form-card">
        <form onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="source">From</label>
              <input
                type="text"
                id="source"
                name="source"
                value={filters.source}
                onChange={handleFilterChange}
                placeholder="Source station"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">To</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={filters.destination}
                onChange={handleFilterChange}
                placeholder="Destination station"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={filters.date}
                min={todayDate}
                onChange={handleFilterChange}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {trains.length > 0 && (
        <div className="results-summary">
          <span>{resultLabel}</span>
          <span>
            {filters.source.trim() || 'Source'} → {filters.destination.trim() || 'Destination'}
            {' • '}
            {formatJourneyDate(filters.date)}
          </span>
        </div>
      )}

      <div className="trains-list">
        {trains.map(train => {
          const routeDetails = getRouteDetails(train, filters.source, filters.destination);

          return (
            <div key={train.trainId} className="train-card">
              <div className="train-header">
                <div>
                  <h3>{train.trainNo}</h3>
                  <p className="train-subtitle">
                    {routeDetails.sourceStation?.stationName || filters.source.trim()} →{' '}
                    {routeDetails.destinationStation?.stationName || filters.destination.trim()}
                  </p>
                </div>
                <span className="available-seats">
                  {train.availableSeats} seats available
                </span>
              </div>

              <div className="train-details-grid">
                <div className="detail-card">
                  <span className="detail-label">Departure</span>
                  <strong>{formatTime(routeDetails.sourceStation?.departureTime)}</strong>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Arrival</span>
                  <strong>{formatTime(routeDetails.destinationStation?.arrivalTime)}</strong>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Total seats</span>
                  <strong>{train.totalSeats}</strong>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Stops in between</span>
                  <strong>{routeDetails.stopsBetween ?? 'N/A'}</strong>
                </div>
              </div>

              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedTrain(train)}
              >
                Select & Book
              </button>
            </div>
          );
        })}
      </div>

      {selectedTrain && (
        <div className="booking-modal">
          <div className="modal-content">
            <span 
              className="close-btn" 
              onClick={() => setSelectedTrain(null)}
            >
              ×
            </span>
            <h2>Book Ticket - Train {selectedTrain.trainNo}</h2>
            <p className="booking-subtitle">
              {filters.source.trim()} → {filters.destination.trim()} • {formatJourneyDate(filters.date)}
            </p>
            
            {bookingError && <div className="alert alert-error">{bookingError}</div>}

            <form onSubmit={handleBooking}>
              <p className="booking-helper">
                Your seat will be assigned automatically from the available seats.
              </p>

              <button type="submit" className="btn btn-primary btn-block">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchTrains;
