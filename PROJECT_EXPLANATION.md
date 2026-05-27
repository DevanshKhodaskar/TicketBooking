# Ticket Booking Project Explanation

This file explains the current project structure, what each important file does, and how the system works end to end.

## 1. Project purpose

This is a **train ticket booking system** with:
- **Spring Boot backend** in `app/`
- **React frontend** in `frontend/`
- **MySQL database schema** in `database/`

The main user flow is:
1. user signs up or logs in
2. user searches trains by **source + destination + date**
3. user books a ticket
4. the system creates or uses a **date-specific train run**
5. available seats reduce for that specific date
6. user can view and cancel bookings

## 2. Top-level folders and files

### Root
- `README.md` - general project intro and setup notes
- `SETUP_GUIDE.md` - setup guide
- `QUICK_REFERENCE.md` - quick commands/reference notes
- `settings.gradle` - includes the `app` backend module
- `gradlew`, `gradlew.bat`, `gradle/` - Gradle wrapper and build support
- `import-database.bat`, `import-database.ps1` - helper scripts for DB import

### Main folders
- `app/` - backend source code
- `frontend/` - React app
- `database/` - schema and sample data

Note: some legacy folders may still exist as empty folders from older versions, but the active app logic is driven by the files explained below.

## 3. Backend structure (`app/src/main/java/ticket/booking`)

### `App.java`
Entry point of the Spring Boot app.

Responsibilities:
- starts the backend server
- defines a `corsConfigurer()` bean
- allows frontend origins like `http://localhost:3000`

### `config/SecurityConfig.java`
Spring Security configuration.

Current behavior:
- disables CSRF
- permits all requests for development
- disables HTTP Basic auth
- provides `BCryptPasswordEncoder`

Important note: security is currently relaxed for development. API requests are not actually protected by real JWT validation.

## 4. Backend controllers

### `controller/AuthController.java`
Handles authentication-related endpoints.

Endpoints:
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/user/{userId}`

Uses `UserService`.

### `controller/TrainController.java`
Handles train-related APIs.

Endpoints:
- `GET /trains`
- `GET /trains/{trainId}`
- `GET /trains/search?source=&destination=&date=`
- `POST /trains`
- `GET /trains/{trainId}/available-seats?date=`

Uses `TrainService`.

### `controller/TicketController.java`
Handles booking and booking management.

Endpoints:
- `POST /tickets/book`
- `GET /tickets/user/{userId}`
- `GET /tickets/{ticketId}`
- `DELETE /tickets/{ticketId}`

Uses `TicketService`.

## 5. Backend DTOs

### `dto/ApiResponse.java`
Standard response wrapper used by controllers.

Fields:
- `success`
- `message`
- `data`

### `dto/LoginRequest.java`
Request body for login.

Fields:
- `name`
- `password`

### `dto/SignupRequest.java`
Request body for signup.

Fields:
- `name`
- `password`

### `dto/BookingRequest.java`
Request body for booking a ticket.

Fields:
- `userId`
- `trainId`
- `seatNumber` (optional in current flow)
- `source`
- `destination`
- `dateOfTravel`

### `dto/TicketResponse.java`
Custom response object returned after booking and when loading bookings.

Contains:
- `ticketId`
- train summary
- seat summary
- `source`
- `destination`
- `dateOfTravel`
- `ticketStatus`
- `createdAt`

This DTO is used so the frontend gets clean nested ticket data instead of raw JPA entities.

## 6. Backend entities (database model)

### `entities/User.java`
Represents a user account.

Important fields:
- `userId`
- `name`
- `password`
- `hashedPassword`
- `ticketsBooked`

### `entities/Train.java`
Represents static train information.

Important fields:
- `trainId`
- `trainNo`
- `totalSeats`
- `availableSeats` (`@Transient`, computed at runtime)
- `stations`
- `seats`
- `runs`

`availableSeats` is not a direct DB column anymore. It is filled dynamically based on `train_runs` for the requested date.

### `entities/TrainStation.java`
Represents one stop in a train route.

Important fields:
- `stationName`
- `stationSequence`
- `arrivalTime`
- `departureTime`

This is what lets the backend decide whether a train goes from the selected source to the selected destination in the correct order.

### `entities/TrainSeat.java`
Represents static seat inventory for a train.

Important fields:
- `seatId`
- `train`
- `seatNumber`

Seats are no longer globally booked in this table. Booking is now tracked by tickets linked to a specific train run.

### `entities/TrainRun.java`
Represents a **date-specific run** of a train.

Important fields:
- `runId`
- `train`
- `travelDate`
- `availableSeats`
- `runStatus`

This is the key part of date-based availability.

### `entities/Ticket.java`
Represents a booked or cancelled ticket.

Important fields:
- `ticketId`
- `user`
- `run`
- `seat`
- `source`
- `destination`
- `ticketStatus`

The ticket is linked to `run`, not directly to train-date fields.

## 7. Backend repositories

These files are the JPA data-access layer.

- `repository/UserRepository.java` - find users, especially by username
- `repository/TrainRepository.java` - basic train access
- `repository/TrainStationRepository.java` - get ordered route stations for a train
- `repository/TrainSeatRepository.java` - load seat inventory for a train
- `repository/TrainRunRepository.java` - find a train run by train/date and lock it during booking
- `repository/TicketRepository.java` - fetch user tickets and check seat usage for a run

Important detail: `TrainRunRepository.findForUpdate(...)` uses pessimistic locking to reduce race conditions during booking.

## 8. Backend services (business logic)

### `service/UserService.java`
Handles signup, login, and user lookup.

Behavior:
- signup checks if username already exists
- password is hashed using `UserServiceUtil`
- login verifies hashed password
- current login returns a **placeholder token string**, not a real JWT

### `service/TrainService.java`
Handles train listing and train search.

Main logic:
- loads all trains
- loads route stations for each train
- calculates available seats for the selected date using `train_runs`
- filters trains only if source comes before destination in route order
- ignores blank or missing search input

### `service/TicketService.java`
Contains the main booking logic.

Main logic in `bookTicket(...)`:
1. validate user
2. validate train
3. validate travel date
4. reject past dates
5. confirm source/destination exist in route order
6. ensure train seats exist
7. get or create the correct `TrainRun` for that date
8. find an available seat for that run
9. reduce `run.availableSeats`
10. create and save ticket
11. return `TicketResponse`

Cancellation logic:
- marks ticket as `CANCELLED`
- increases `train_run.availableSeats`

### `util/UserServiceUtil.java`
Password helper methods.

Functions:
- `hashPassword(...)`
- `checkPassword(...)`

## 9. Frontend structure (`frontend/src`)

### `index.js`
React entry point. Mounts `<App />`.

### `App.js`
Main frontend router.

Responsibilities:
- runs `checkAuth()` on load
- defines routes
- protects `/search` and `/bookings` so only logged-in users can access them
- shows `Navigation`

Routes:
- `/` -> `Home`
- `/login` -> `Login`
- `/signup` -> `Signup`
- `/search` -> `SearchTrains`
- `/bookings` -> `MyBookings`

### `components/Navigation.js`
Top navigation bar.

Behavior:
- shows login/signup if user is logged out
- shows search/bookings/logout if user is logged in

### `services/api.js`
Axios client used everywhere in the frontend.

Responsibilities:
- uses backend base URL `http://localhost:8080/api`
- attaches `Authorization` header if `token` exists in local storage
- clears auth and redirects to login on `401`

### `store/authStore.js`
Zustand auth state store.

Responsibilities:
- store `user`, `token`, `loading`, `error`
- `signup(...)`
- `login(...)`
- `logout()`
- `checkAuth()`

Important note: login currently assumes the returned token can be used to derive the user ID. This is a temporary approach because the backend does not yet issue a real JWT payload.

## 10. Frontend pages

### `pages/Home.js`
Landing page. Shows main actions based on login state.

### `pages/Login.js`
Login form.

Behavior:
- validates empty fields
- calls `authStore.login(...)`
- redirects to home on success

### `pages/Signup.js`
Signup form.

Behavior:
- validates empty fields
- checks password match
- checks minimum password length
- calls `authStore.signup(...)`

### `pages/SearchTrains.js`
Most important frontend page for train search and booking.

Responsibilities:
- stores `source`, `destination`, `date`
- blocks past dates in UI
- calls `/trains/search`
- normalizes backend `snake_case` and `camelCase` field differences
- shows route details, times, total seats, and available seats
- opens booking modal
- books tickets using `/tickets/book`
- auto-assigns seats instead of asking user to choose one

### `pages/MyBookings.js`
Shows user bookings and supports cancellation.

Behavior:
- loads bookings from `/tickets/user/{userId}`
- displays ticket id, train, route, date, seat, and status
- lets user cancel booked tickets

### CSS files
- `App.css` - global app styling
- `components/Navigation.css` - navbar styling
- `pages/Auth.css` - shared login/signup styles
- `pages/Home.css` - home page styles
- `pages/SearchTrains.css` - search page and booking modal styles
- `pages/MyBookings.css` - bookings page styles

### Test file
- `pages/SearchTrains.test.js` - focused test coverage for search and booking UI behavior

## 11. Database design (`database/schema.sql`)

Current tables:
- `users`
- `trains`
- `train_stations`
- `train_seats`
- `train_runs`
- `tickets`

Why `train_runs` exists:
- one train can run on many dates
- available seats must be tracked per date
- booking on one date should not block the same seat on another date

## 12. End-to-end flow

### Signup flow
`Signup.js` -> `authStore.signup()` -> `POST /auth/signup` -> `AuthController` -> `UserService.signup()` -> `UserRepository`

### Login flow
`Login.js` -> `authStore.login()` -> `POST /auth/login` -> `AuthController` -> `UserService.login()`

### Search flow
`SearchTrains.js` -> `GET /trains/search?source&destination&date` -> `TrainController` -> `TrainService.searchTrains()` -> repositories -> response with trains and computed `availableSeats`

### Booking flow
`SearchTrains.js` -> `POST /tickets/book` -> `TicketController` -> `TicketService.bookTicket()` ->
- validate user/train/date/route
- lock or create train run
- choose seat
- save ticket
- reduce run seat count

### My Bookings flow
`MyBookings.js` -> `GET /tickets/user/{userId}` -> `TicketController` -> `TicketService.getUserTickets()` -> `TicketResponse[]`

### Cancel flow
`MyBookings.js` -> `DELETE /tickets/{ticketId}` -> `TicketController` -> `TicketService.cancelTicket()` -> increase run seat count

## 13. Important implementation notes

- JSON from entities often uses `snake_case` because of Jackson naming annotations.
- The frontend includes normalization helpers because some responses may arrive in either `snake_case` or `camelCase`.
- Auth is currently **session-like via local storage**, not true secure JWT auth.
- `password` and `hashed_password` are both stored in the DB right now; that is not ideal for production.
- Search and booking are now **date-aware**.
- Past-date booking is blocked in both frontend and backend.

## 14. If you need to explain this project quickly

Use this one-line summary:

> This project is a React + Spring Boot + MySQL train ticket booking system where users authenticate, search trains by route and date, and book date-specific train runs whose seat availability is tracked in the `train_runs` table.
