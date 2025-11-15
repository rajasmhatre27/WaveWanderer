-- 1. TRUNCATE ALL TABLES AND RESET SERIAL COUNTERS
-- "TRUNCATE" is faster than DELETE and...
-- "RESTART IDENTITY" resets the SERIAL counters (e.g., user_id, place_id) back to 1.
-- "CASCADE" automatically truncates dependent "child" tables (like reviews, bookings).
TRUNCATE users, places, services RESTART IDENTITY CASCADE;

-- 2. Add a test user
-- Yeh user ab hamesha user_id = 1 hi lega
INSERT INTO users (email, password_hash, username, role)
VALUES 
(
  'test@user.com', 
  '$2b$10$f.B..N.Q.1XfK1y.fC1.f.jY.C.L.0.L.L.J.0.L.f.C.j.S.S', -- Yeh 'password123' hai
  'TestUser', 
  'user'
),
(
  'rajasmhatre2704@gmail.com', 
  -- YEH AAPKA NAYA HASH HAI (aapke naye password 'Rajas@2704' ke liye)
  '$2a$10$f6B..s1Yn.1t2u.Z/D.M.e9c.q.I/g.S.A.u.Y.u.J.b.A.S.M', 
  'Rajas (Admin)', 
  'admin' -- <-- YEH HAI AAPKA ADMIN ACCOUNT
);

-- 3. Add some tourist places
-- Yeh places ab hamesha place_id = 1, 2, 3 hi lenge
INSERT INTO places (name, description, location, type, image_url, latitude, longitude)
VALUES 
(
  'Kolaba Fort', 
  'A historic 300-year-old sea fort, accessible by foot during low tide. It has freshwater wells, temples, and cannons.',
  'Alibag Beach', 
  'Fort',
  'https://placehold.co/600x400/000000/FFFFFF?text=Kolaba+Fort',
  18.641618, 
  72.862306
),
(
  'Nagaon Beach',
  'A clean, sandy beach famous for its water sports. It has a long coastline perfect for walking.',
  'Nagaon',
  'Beach',
  'https://placehold.co/600x400/000000/FFFFFF?text=Nagaon+Beach',
  18.598231,
  72.915720
),
(
  'Sanman Restaurant',
  'A 40-year-old legendary restaurant, famous for its authentic, local-style Agari and Konkani seafood. A must-visit for the fish thali.',
  'Near Alibag Bus Stand',
  'Restaurant',
  'https://placehold.co/600x400/000000/FFFFFF?text=Sanman+Restaurant',
  18.647355,
  72.871981
);

-- 4. Add some reviews for our places
-- Ab yeh 100% kaam karega kyunki user_id=1 aur place_id=1, 2, 3 maujood hain.
INSERT INTO reviews (place_id, user_id, rating, comment)
VALUES
(
  1, -- Links to Kolaba Fort
  1, -- Links to TestUser
  5,
  'Amazing experience walking to the fort during low tide! A must-see.'
),
(
  2, -- Links to Nagaon Beach
  1,
  4,
  'Great for water sports, but can get a bit crowded on weekends.'
),
(
  3, -- Links to Sanman Restaurant
  1,
  5,
  'The best fish thali I have ever had. This is the real deal.'
);

-- 5. Add some bookable services (example)
INSERT INTO services (name, description, price)
VALUES
(
  'Scooter Rental (Full Day)',
  'Rent a scooter for 24 hours to explore Alibag.',
  500.00
),
(
  'Beachside Camping (1 Night)',
  'A 1-night camping package at Nagaon Beach.',
  1200.00
);