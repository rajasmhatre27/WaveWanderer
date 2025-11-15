-- This is our "blueprint" file for creating the database tables.
-- Ismein "role" column add kar diya gaya hai.

-- We'll use "DROP TABLE...CASCADE" to make it easy to re-run this file.
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- TABLE 1: users (Updated with "role")
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    
    -- YEH NAYA COLUMN HAI --
    -- 'admin' ya 'user' store karega.
    role VARCHAR(50) NOT NULL DEFAULT 'user', 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: places (No Change)
CREATE TABLE places (
    place_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    type VARCHAR(100),
    image_url VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
);

-- TABLE 3: reviews (No Change)
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 4: services (No Change)
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- TABLE 5: bookings (No Change)
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    service_id INT NOT NULL REFERENCES services(service_id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed'
);

-- Database tables created successfully!