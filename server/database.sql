-- This is our "blueprint" file for creating the database tables.

-- We'll use "DROP TABLE...CASCADE" to make it easy to re-run this file.
-- This deletes the tables if they already exist, so we start fresh.
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- TABLE 1: users
-- Stores all our user accounts.
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: places
-- Stores all the tourist spots.
CREATE TABLE places (
    place_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    type VARCHAR(100), -- 'Beach', 'Fort', 'Restaurant', 'Hidden Gem'
    image_url VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
);

-- TABLE 3: reviews
-- Stores reviews and links them to a user and a place.
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    
    -- This is the "link" (Foreign Key) to the places table.
    -- If a place is deleted, all its reviews are also deleted (ON DELETE CASCADE).
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE,
    
    -- This is the "link" (Foreign Key) to the users table.
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 4: services
-- Stores things that can be booked (e.g., tickets, rentals).
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL -- e.g., 1500.00
);

-- TABLE 5: bookings
-- This table links a user to a service they paid for.
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    
    -- Foreign Key to the users table
    user_id INT NOT NULL REFERENCES users(user_id),
    
    -- Foreign Key to the services table
    service_id INT NOT NULL REFERENCES services(service_id),
    
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed'
);

-- A little message to let us know it worked!
-- ... (all your CREATE TABLE code above) ...

-- A little message to let us know it worked!
-- Database tables created successfully!