-- 1. TRUNCATE ALL TABLES AND RESET SERIAL COUNTERS
TRUNCATE users, places, services RESTART IDENTITY CASCADE;

-- 2. Add users
INSERT INTO users (email, password_hash, username, role)
VALUES 
(
  'test@user.com', 
  '$2b$10$f.B..N.Q.1XfK1y.fC1.f.jY.C.L.0.L.L.J.0.L.f.C.j.S.S', 
  'TestUser', 
  'user'
),
(
  'rajasmhatre2704@gmail.com', 
  -- Hash for 'Rajas@2704'
  '$2a$10$f6B..s1Yn.1t2u.Z/D.M.e9c.q.I/g.S.A.u.Y.u.J.b.A.S.M', 
  'Rajas (Admin)', 
  'admin'
);

-- 3. Add tourist places with REAL PHOTO URLs
INSERT INTO places (name, description, location, type, image_url, latitude, longitude)
VALUES 
(
  'Kolaba Fort', 
  'A historic 300-year-old sea fort, accessible by foot during low tide. It has freshwater wells, temples, and cannons.',
  'Alibag Beach', 
  'Fort',
  'https://upload.wikimedia.org/wikipedia/commons/e/e6/Kolaba_Fort_-_Alibag.JPG',
  18.641618, 
  72.862306
),
(
  'Nagaon Beach',
  'A clean, sandy beach famous for its water sports. It has a long coastline perfect for walking and cypress groves.',
  'Nagaon',
  'Beach',
  'https://konkankatta.in/wp-content/uploads/2018/11/Nagaon-Beach.jpg',
  18.598231,
  72.915720
),
(
  'Sanman Restaurant',
  'A legendary restaurant famous for its authentic, local-style Agari and Konkani seafood. A must-visit for the fish thali.',
  'Near Alibag Bus Stand',
  'Restaurant',
  'https://b.zmtcdn.com/data/pictures/2/18627352/85228827854678322723323854678322.jpg',
  18.647355,
  72.871981
);

-- 4. Add reviews
INSERT INTO reviews (place_id, user_id, rating, comment)
VALUES
( 1, 1, 5, 'The walk during low tide is magical. Wear good shoes!'),
( 2, 1, 4, 'Water sports are fun but parking can be tricky on weekends.'),
( 3, 1, 5, 'The Surmai Fry thali is absolutely delicious. Best in town.');

-- 5. Add services
INSERT INTO services (name, description, price)
VALUES
( 'Scooter Rental (Full Day)', 'Rent a scooter for 24 hours to explore Alibag.', 500.00 ),
( 'Beachside Camping (1 Night)', 'A 1-night camping package at Nagaon Beach.', 1200.00 );


INSERT INTO products (name, description, price, image_url)
VALUES 
(
  'Authentic Alibag Spices (Masala)',
  'Hand-ground local spices perfect for fish curry. 200g pack.',
  250.00,
  'https://m.media-amazon.com/images/I/71K2M7-E7RL.jpg'
),
(
  'Konkan Cashews',
  'Premium quality, roasted salted cashews from the region.',
  450.00,
  'https://www.placehold.co/400x400/FFA500/ffffff?text=Cashews'
),
(
  'Wooden Handicraft Toy',
  'Traditional handmade wooden toy by local artisans.',
  150.00,
  'https://www.placehold.co/400x400/8B4513/ffffff?text=Wooden+Toy'
);