# API Testing Guide

## Request Examples with cURL

### 1. User Registration (Signup)

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john_doe",
    "password": "securepass123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "john_doe",
    "password": "securepass123",
    "hashedPassword": "$2a$10$...",
    "ticketsBooked": [],
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists",
  "data": null
}
```

### 2. User Login

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john_doe",
    "password": "securepass123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": "jwt-token-550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

### 3. Get User Details

**Request:**
```bash
curl -X GET http://localhost:8080/api/auth/user/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer jwt-token-550e8400-e29b-41d4-a716-446655440000"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "john_doe",
    "hashedPassword": "$2a$10$...",
    "ticketsBooked": [
      {
        "ticketId": "660e8400-e29b-41d4-a716-446655440000",
        "source": "Delhi",
        "destination": "Mumbai",
        "dateOfTravel": "2024-01-20",
        "ticketStatus": "BOOKED"
      }
    ]
  }
}
```

### 4. Get All Trains

**Request:**
```bash
curl -X GET http://localhost:8080/api/trains
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trains retrieved",
  "data": [
    {
      "trainId": "tr-001",
      "trainNo": "TR001",
      "totalSeats": 100,
      "availableSeats": 45,
      "stations": [
        {
          "stationName": "Delhi",
          "stationSequence": 1,
          "arrivalTime": "08:00:00",
          "departureTime": "08:30:00"
        },
        {
          "stationName": "Jaipur",
          "stationSequence": 2,
          "arrivalTime": "11:00:00",
          "departureTime": "11:30:00"
        },
        {
          "stationName": "Mumbai",
          "stationSequence": 3,
          "arrivalTime": "18:00:00",
          "departureTime": "18:00:00"
        }
      ]
    }
  ]
}
```

### 5. Search Trains by Route

**Request:**
```bash
curl -X GET "http://localhost:8080/api/trains/search?source=Delhi&destination=Mumbai"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trains found",
  "data": [
    {
      "trainId": "tr-001",
      "trainNo": "TR001",
      "totalSeats": 100,
      "availableSeats": 45
    }
  ]
}
```

### 6. Get Train Details

**Request:**
```bash
curl -X GET http://localhost:8080/api/trains/tr-001
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Train retrieved",
  "data": {
    "trainId": "tr-001",
    "trainNo": "TR001",
    "totalSeats": 100,
    "availableSeats": 45,
    "stations": []
  }
}
```

### 7. Get Available Seats

**Request:**
```bash
curl -X GET http://localhost:8080/api/trains/tr-001/available-seats
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Available seats",
  "data": 45
}
```

### 8. Book a Ticket

**Request:**
```bash
curl -X POST http://localhost:8080/api/tickets/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "trainId": "tr-001",
    "seatNumber": "1A",
    "source": "Delhi",
    "destination": "Mumbai",
    "dateOfTravel": "2024-01-20"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Ticket booked successfully",
  "data": {
    "ticketId": "660e8400-e29b-41d4-a716-446655440000",
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "john_doe"
    },
    "train": {
      "trainId": "tr-001",
      "trainNo": "TR001"
    },
    "seat": {
      "seatId": "seat-1a",
      "seatNumber": "1A",
      "isBooked": true
    },
    "source": "Delhi",
    "destination": "Mumbai",
    "dateOfTravel": "2024-01-20",
    "ticketStatus": "BOOKED",
    "createdAt": "2024-01-15T15:30:00"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Seat is already booked",
  "data": null
}
```

### 9. Get User Bookings

**Request:**
```bash
curl -X GET http://localhost:8080/api/tickets/user/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User tickets retrieved",
  "data": [
    {
      "ticketId": "660e8400-e29b-41d4-a716-446655440000",
      "user": {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "john_doe"
      },
      "train": {
        "trainId": "tr-001",
        "trainNo": "TR001"
      },
      "source": "Delhi",
      "destination": "Mumbai",
      "dateOfTravel": "2024-01-20",
      "ticketStatus": "BOOKED",
      "createdAt": "2024-01-15T15:30:00"
    }
  ]
}
```

### 10. Get Ticket Details

**Request:**
```bash
curl -X GET http://localhost:8080/api/tickets/660e8400-e29b-41d4-a716-446655440000
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Ticket retrieved",
  "data": {
    "ticketId": "660e8400-e29b-41d4-a716-446655440000",
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "john_doe"
    },
    "train": {
      "trainId": "tr-001",
      "trainNo": "TR001"
    },
    "source": "Delhi",
    "destination": "Mumbai",
    "dateOfTravel": "2024-01-20",
    "ticketStatus": "BOOKED"
  }
}
```

### 11. Cancel a Ticket

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/tickets/660e8400-e29b-41d4-a716-446655440000
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Ticket cancelled successfully",
  "data": "660e8400-e29b-41d4-a716-446655440000"
}
```

## Testing Tools

### Postman Collection

Save as `postman_collection.json`:

```json
{
  "info": {
    "name": "Ticket Booking API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Signup",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/auth/signup",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {"raw": "{\"name\": \"john_doe\", \"password\": \"pass123\"}"}
      }
    },
    {
      "name": "Get All Trains",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/trains"
      }
    }
  ]
}
```

### Using Postman
1. Create new collection
2. Import endpoints from above
3. Set variables for `baseUrl`, `userId`, `token`
4. Test each endpoint

## Error Codes Reference

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid data or missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Backend error |

## Common Test Scenarios

### Scenario 1: Complete User Journey
```bash
# 1. Sign up
USER_ID=$(curl -s -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"test_user","password":"test123"}' | jq '.data.userId')

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"test_user","password":"test123"}' | jq '.data')

# 3. Search trains
curl -s -X GET "http://localhost:8080/api/trains/search?source=Delhi&destination=Mumbai"

# 4. Book ticket
curl -s -X POST http://localhost:8080/api/tickets/book \
  -H "Content-Type: application/json" \
  -d "{\"userId\":$USER_ID, \"trainId\":\"tr-001\", \"seatNumber\":\"1A\", \"source\":\"Delhi\", \"destination\":\"Mumbai\", \"dateOfTravel\":\"2024-01-20\"}"

# 5. View bookings
curl -s -X GET "http://localhost:8080/api/tickets/user/$USER_ID"
```

## Performance Testing

```bash
# Load test signup endpoint (100 requests)
for i in {1..100}; do
  curl -s -X POST http://localhost:8080/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"user$i\", \"password\":\"pass$i\"}"
done
```

---

**Tip:** Use `jq` to parse JSON responses:
```bash
curl -s <url> | jq '.data'
```

Install jq:
```bash
# Mac
brew install jq

# Ubuntu
sudo apt-get install jq

# Windows
choco install jq
```
