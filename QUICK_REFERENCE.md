# Quick Reference Guide

## 🚀 Quick Commands

### Initial Setup (One-time)

#### Database Import - Windows
```batch
REM Using batch file (easiest)
import-database.bat

REM Or using PowerShell
Get-Content "database\schema.sql" | &"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

#### Database Import - Linux/Mac
```bash
mysql -u root -p < database/schema.sql
```

2. Update credentials in `app/src/main/resources/application.yml`

3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### Daily Development

```bash
# Terminal 1: Run Backend
cd app
./gradlew bootRun

# Terminal 2: Run Frontend
cd frontend
npm start
```

## 📍 Important Files

| File | Purpose |
|------|---------|
| `app/src/main/resources/application.yml` | Database config |
| `database/schema.sql` | Database schema |
| `app/build.gradle` | Backend dependencies |
| `frontend/package.json` | Frontend dependencies |
| `app/src/main/java/ticket/booking/App.java` | Spring Boot entry point |
| `frontend/src/App.js` | React entry point |

## 🔌 Port Configuration

- **Backend API**: `http://localhost:8080/api`
- **Frontend App**: `http://localhost:3000`
- **MySQL**: `localhost:3306`

### Change Ports (if needed)

```bash
# Backend port
./gradlew bootRun --args='--server.port=8081'

# Frontend port
npm start -- --port 3001

# Update frontend API URL in src/services/api.js
baseURL: 'http://localhost:8081/api'
```

## 🗄️ Database Operations

### Reset Database
```bash
# Drop and recreate
mysql -u root -p
DROP DATABASE ticket_booking;
SOURCE database/schema.sql;
```

### Add Sample Data
```sql
-- Insert sample user
INSERT INTO users (user_id, name, password, hashed_password)
VALUES ('user1', 'john', 'password123', '$2a$10$...');

-- Insert sample train
INSERT INTO trains (train_id, train_no, total_seats, available_seats)
VALUES ('train1', 'TR001', 100, 100);

-- Insert sample seats
INSERT INTO train_seats (seat_id, train_id, seat_number, is_booked)
VALUES ('seat1', 'train1', '1A', false);
```

## 🔧 Backend Operations

### Build Only
```bash
./gradlew build
```

### Clean Build
```bash
./gradlew clean build
```

### Run Tests
```bash
./gradlew test
```

### Check Gradle Tasks
```bash
./gradlew tasks
```

## 🎨 Frontend Operations

### Install New Package
```bash
cd frontend
npm install package-name
```

### Update Dependencies
```bash
cd frontend
npm update
```

### Check for Vulnerabilities
```bash
cd frontend
npm audit
npm audit fix
```

## 🐛 Debugging

### Backend Debugging
- Logs appear in terminal running `./gradlew bootRun`
- Check `application.yml` logging levels
- Use breakpoints in IDE (VS Code/IntelliJ)

### Frontend Debugging
- Open DevTools: F12 or Right-click → Inspect
- Console tab for errors
- Network tab for API calls
- Application tab for localStorage

### API Testing
```bash
# Test backend is running
curl http://localhost:8080/api/trains

# Test specific endpoint
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"test","password":"test123"}'
```

## 📦 Project Structure Commands

### View Backend Structure
```bash
tree app/src -L 3
```

### View Frontend Structure
```bash
tree frontend/src -L 2
```

## 🔄 Git Operations

### Initial Commit
```bash
git init
git add .
git commit -m "Initial commit: Full-stack ticket booking app"
```

### Create Feature Branch
```bash
git checkout -b feature/new-feature
```

### Useful Commits
```bash
# Update: Description
git commit -m "Update: Add payment integration"

# Fix: Description
git commit -m "Fix: CORS error in API calls"

# Feature: Description
git commit -m "Feature: Add seat visualization"
```

## 🚨 Common Issues & Solutions

### Issue: Backend won't start
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Check port is free
lsof -i :8080  # Linux/Mac
netstat -ano | findstr :8080  # Windows

# Try clean rebuild
./gradlew clean build
./gradlew bootRun
```

### Issue: Frontend blank page
```bash
# Check browser console for errors (F12)
# Clear cache and refresh (Ctrl+Shift+R)
# Check backend API is running
curl http://localhost:8080/api/trains
```

### Issue: Database connection error
```bash
# Test connection
mysql -u root -p ticket_booking

# Check credentials in application.yml
# Verify MySQL service is running
```

### Issue: Port conflicts
```bash
# Find what's using the port (Linux/Mac)
lsof -i :8080

# Find what's using the port (Windows)
netstat -ano | findstr :8080

# Kill the process if needed
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

## 📊 Monitoring

### Check Backend Health
```bash
# If you add a health endpoint
curl http://localhost:8080/api/actuator/health
```

### Monitor Database
```bash
mysql -u root -p ticket_booking
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM trains;
```

## 🔐 Security Reminders

✅ **DO:**
- Use strong passwords in database config
- Keep credentials in `.env` or environment variables
- Use HTTPS in production
- Validate all inputs
- Use parameterized queries (JPA handles this)

❌ **DON'T:**
- Store credentials in code
- Use default passwords
- Commit `.env` files
- Skip input validation
- Use hardcoded API keys

## 📚 Learning Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [MySQL Docs](https://dev.mysql.com/doc/)

## 💡 Pro Tips

1. **Use console.log() strategically** - Frontend debugging
2. **Use @Slf4j annotation** - Backend logging (add dependency)
3. **Use React DevTools extension** - Better debugging
4. **Use Postman** - Test APIs without frontend
5. **Keep terminal windows organized** - One for each service
6. **Use `.gitignore`** - Already configured
7. **Make small commits** - Easier to track changes
8. **Test locally first** - Before deployment

## 🚀 Production Deployment

```bash
# Build backend
./gradlew build

# Build frontend
cd frontend && npm run build

# Deploy:
# - Backend JAR to server
# - Frontend build to static hosting
# - Database to production MySQL
```

---

Need more help? Check the main [README.md](README.md) or [SETUP_GUIDE.md](SETUP_GUIDE.md)
