# Ticket Booking System

A complete ticket booking application with Spring Boot backend and React frontend, using MySQL database.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup (30 seconds)

```bash
# Navigate to project root
cd ticketBooking

# Create MySQL database
mysql -u root -p < database/schema.sql

# Update database credentials in app/src/main/resources/application.yml

# Build and run backend
./gradlew bootRun
```

Backend runs on: `http://localhost:8080/api`

### Frontend Setup (30 seconds)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

## 📋 Project Structure

```
ticketBooking/
├── app/                          # Backend (Spring Boot)
│   ├── src/main/java/ticket/booking/
│   │   ├── App.java             # Spring Boot entry point
│   │   ├── controller/          # REST API controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access (JPA)
│   │   ├── entities/            # Database entities
│   │   ├── dto/                 # Data transfer objects
│   │   └── util/                # Utilities
│   ├── src/main/resources/
│   │   └── application.yml      # Configuration
│   └── build.gradle             # Dependencies
├── frontend/                     # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API client
│   │   ├── store/              # State management
│   │   └── App.js              # Main app
│   └── package.json            # Dependencies
├── database/
│   └── schema.sql              # MySQL schema
├── SETUP_GUIDE.md              # Detailed setup
└── README.md                   # This file
```

## 🗄️ Database

### Tables
- **users** - User accounts with hashed passwords
- **trains** - Train information
- **train_stations** - Train routes and schedules
- **train_seats** - Individual seat tracking
- **tickets** - Booking records

### Setup
```bash
mysql -u root -p < database/schema.sql
```

Update credentials in `app/src/main/resources/application.yml`

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/user/{userId}` | Get user details |

### Trains
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trains` | List all trains |
| GET | `/trains/{trainId}` | Get train details |
| GET | `/trains/search` | Search by route |
| POST | `/trains` | Create train |
| GET | `/trains/{trainId}/available-seats` | Check availability |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tickets/book` | Book ticket |
| GET | `/tickets/user/{userId}` | Get user bookings |
| GET | `/tickets/{ticketId}` | Get ticket details |
| DELETE | `/tickets/{ticketId}` | Cancel ticket |

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.1.5
- **Database**: MySQL 8
- **ORM**: JPA/Hibernate
- **Security**: BCrypt password hashing
- **Build**: Gradle
- **Java**: 17+

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **State**: Zustand
- **HTTP**: Axios
- **Styling**: CSS3
- **Node**: 16+

## 📝 Example Usage

### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"john","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"john","password":"pass123"}'
```

### Search Trains
```bash
curl "http://localhost:8080/api/trains/search?source=Delhi&destination=Mumbai"
```

### Book a Ticket
```bash
curl -X POST http://localhost:8080/api/tickets/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-id",
    "trainId":"train-id",
    "seatNumber":"1A",
    "source":"Delhi",
    "destination":"Mumbai",
    "dateOfTravel":"2024-12-25"
  }'
```

## 🔒 Security Features

- **Password Security**: BCrypt hashing
- **CORS**: Configured for frontend
- **JWT-ready**: Can be extended with JWT tokens
- **Transaction Safety**: @Transactional annotations
- **Input Validation**: Request validation in DTOs

## 📊 Features

✅ User registration and authentication
✅ Train search by route
✅ Real-time seat availability
✅ Ticket booking with seat selection
✅ Booking management (view/cancel)
✅ Responsive UI (mobile-friendly)
✅ Error handling and validation
✅ Persistent data storage

## 🚦 Running the Application

### Start Backend
```bash
cd app
./gradlew bootRun
```

### Start Frontend
```bash
cd frontend
npm start
```

### Access Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`

## 🧪 Testing

### Manual Testing
1. Sign up a new user
2. Search for trains
3. Book a ticket
4. View bookings
5. Cancel a ticket

### API Testing with Postman
- Import endpoints from API section above
- Set base URL: `http://localhost:8080/api`
- Add authorization headers if using JWT

## 🐛 Troubleshooting

### MySQL Connection Error
```
Check database credentials in application.yml
Ensure MySQL service is running: mysql -u root -p
```

### Port Already in Use
```bash
# Change backend port
./gradlew bootRun --args='--server.port=8081'

# Change frontend port
npm start -- --port 3001
```

### CORS Errors
- Verify frontend URL in `App.java` CORS configuration
- Check backend is on `localhost:8080`

### Module Not Found
```bash
# Frontend
cd frontend && npm install

# Backend
cd app && ./gradlew clean build
```

## 📚 Documentation

- [Backend Setup](SETUP_GUIDE.md) - Detailed backend setup
- [Frontend Documentation](frontend/README.md) - Frontend details
- [API Reference](#-api-endpoints) - All endpoints
- [Database Schema](database/schema.sql) - Database structure

## 🔄 Development Workflow

1. **Create branch** for new features
2. **Backend changes**: Update Java files, test with cURL
3. **Frontend changes**: Update React components, test in browser
4. **Commit and push**: Follow conventional commits
5. **Database migrations**: Update schema.sql if needed

## 📈 Future Enhancements

- [ ] JWT token authentication
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced filtering and sorting
- [ ] Admin dashboard
- [ ] Seat visualization
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Real-time notifications
- [ ] Analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Push to your branch
6. Open a pull request

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues and questions:
- Check [Troubleshooting](#-troubleshooting) section
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Check API endpoint documentation

## 🎉 Getting Help

```bash
# Check backend logs
./gradlew bootRun

# Check frontend logs
npm start

# Verify connections
curl http://localhost:8080/api/trains
```

---

**Happy Booking! 🎫**
