# Ticket Booking Frontend - React

A modern, responsive React frontend for the Ticket Booking System.

## Features

- 🔐 User authentication (signup/login)
- 🚂 Train search functionality
- 🎫 Ticket booking system
- 📋 View and manage bookings
- 🎨 Clean, modern UI with responsive design
- 🔄 Real-time updates

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/         # Reusable components
│   └── Navigation.js   # Top navigation bar
├── pages/             # Page components
│   ├── Home.js        # Homepage
│   ├── Login.js       # Login page
│   ├── Signup.js      # Signup page
│   ├── SearchTrains.js # Train search & booking
│   └── MyBookings.js  # User's bookings
├── services/          # API integration
│   └── api.js         # Axios API client
├── store/            # State management
│   └── authStore.js  # Authentication state
├── App.js            # Main app component
└── index.js          # Entry point
```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```
   - Opens at `http://localhost:3000`

3. **Build for production**
   ```bash
   npm run build
   ```

## Environment Configuration

The API base URL is configured in `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});
```

Change this if your backend is running on a different port.

## Key Components

### Authentication Store (Zustand)
- Manages user login/signup state
- Persists token to localStorage
- Handles API token injection

### API Service
- Centralized axios instance
- Automatic token injection
- Error handling with 401 redirects
- CORS-enabled for backend communication

### Pages
- **Home**: Landing page with call-to-action
- **Login**: User login form
- **Signup**: New user registration
- **SearchTrains**: Search, view, and book trains
- **MyBookings**: View booked tickets and cancel bookings

## Usage

### Sign Up
1. Click "Sign Up" button
2. Enter username and password (min 6 chars)
3. Confirm password
4. Click "Sign Up"

### Login
1. Click "Login" button
2. Enter your credentials
3. Click "Login"

### Search & Book Trains
1. Click "Search Trains" (requires login)
2. Enter source, destination, and date
3. Click "Search"
4. Select a train and click "Select & Book"
5. Enter seat number and confirm booking

### Manage Bookings
1. Click "My Bookings" to view all your tickets
2. View ticket details
3. Click "Cancel Ticket" to cancel a booking

## Available Scripts

```bash
# Start development server with hot reload
npm start

# Build optimized production bundle
npm run build

# Run tests
npm test

# Eject (caution: irreversible)
npm run eject
```

## Styling

The project uses CSS3 with:
- CSS Grid for layouts
- Flexbox for components
- CSS Variables for theming (can be added)
- Responsive design with media queries
- Gradient backgrounds
- Box shadows and transitions

## API Integration

All API calls go through `src/services/api.js` which:
- Automatically adds auth tokens
- Handles CORS
- Manages errors
- Redirects on 401 errors

## State Management

Using Zustand for lightweight state management:
- User authentication state
- Persistent storage via localStorage
- Simple store pattern
- No Redux complexity

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox support

## Troubleshooting

### Backend Connection Errors
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify API base URL in `src/services/api.js`

### Login/Signup Issues
- Check browser console for error messages
- Verify backend is accepting requests
- Check localStorage in DevTools

### Port Already in Use
```bash
npm start -- --port 3001
```

## Performance Optimization

- Lazy loading for pages (can be added)
- Memoization for components (can be added)
- Code splitting (built-in with React Router)
- Minification in production build

## Future Enhancements

- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced filters
- [ ] Multi-language support
- [ ] Dark mode
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Seat visualization
