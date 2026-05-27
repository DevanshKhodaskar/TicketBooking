-- Create Ticket Booking Database
CREATE DATABASE IF NOT EXISTS ticket_booking;
USE ticket_booking;

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS train_runs;
DROP TABLE IF EXISTS train_seats;
DROP TABLE IF EXISTS train_stations;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trains Table
CREATE TABLE IF NOT EXISTS trains (
    train_id VARCHAR(36) PRIMARY KEY,
    train_no VARCHAR(50) NOT NULL UNIQUE,
    total_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Train Stations Table (for routes)
CREATE TABLE IF NOT EXISTS train_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_id VARCHAR(36) NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    station_sequence INT NOT NULL,
    arrival_time TIME NOT NULL,
    departure_time TIME NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    UNIQUE KEY unique_train_station (train_id, station_sequence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Train Seats Table
CREATE TABLE IF NOT EXISTS train_seats (
    seat_id VARCHAR(36) PRIMARY KEY,
    train_id VARCHAR(36) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    UNIQUE KEY unique_train_seat (train_id, seat_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Train Runs Table (date-specific inventory per train)
CREATE TABLE IF NOT EXISTS train_runs (
    run_id VARCHAR(36) PRIMARY KEY,
    train_id VARCHAR(36) NOT NULL,
    travel_date DATE NOT NULL,
    available_seats INT NOT NULL,
    run_status ENUM('SCHEDULED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    UNIQUE KEY unique_train_date_run (train_id, travel_date),
    INDEX idx_train_runs_date (travel_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    run_id VARCHAR(36) NOT NULL,
    seat_id VARCHAR(36) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    ticket_status ENUM('BOOKED', 'CANCELLED') DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (run_id) REFERENCES train_runs(run_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES train_seats(seat_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_run_id (run_id),
    INDEX idx_ticket_status (ticket_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_train_source_destination ON trains(train_no);
CREATE INDEX idx_user_name ON users(name);
