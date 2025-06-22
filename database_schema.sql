-- Feast of Esther Database Schema
-- Run this script to create all necessary tables

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL,
    streetaddress VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    zippostalcode VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    nameofchurch VARCHAR(255) NOT NULL,
    positioninminstry VARCHAR(255),
    titleofoffice VARCHAR(255),
    husbandname VARCHAR(255),
    tshirtsize VARCHAR(10) NOT NULL,
    eventId VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_payment_status (payment_status),
    INDEX idx_session_id (session_id)
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    session_id VARCHAR(255),
    session_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_payment_status (payment_status),
    INDEX idx_session_id (session_id)
);

-- Create events table (for future use)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(255),
    registration_fee DECIMAL(10, 2) DEFAULT 0.00,
    max_attendees INT,
    status ENUM('active', 'inactive', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default event
INSERT INTO events (id, name, description, event_date, location, registration_fee, status) 
VALUES (1, 'Feast of Esther 2025 - Houston', 'Annual Feast of Esther event in Houston', '2025-07-10', 'Houston, TX', 120.00, 'active')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    event_date = VALUES(event_date),
    location = VALUES(location),
    registration_fee = VALUES(registration_fee);

-- Add unique constraints to prevent duplicates
ALTER TABLE registrations 
ADD CONSTRAINT unique_email_event UNIQUE (email, eventId);

-- Show table structures
DESCRIBE registrations;
DESCRIBE donations;
DESCRIBE events;

-- Show table counts
SELECT 'registrations' as table_name, COUNT(*) as count FROM registrations
UNION ALL
SELECT 'donations' as table_name, COUNT(*) as count FROM donations
UNION ALL
SELECT 'events' as table_name, COUNT(*) as count FROM events;