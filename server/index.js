// 1. Import our tools
import express from "express";
import cors from "cors";
import pool from "./db.js"; // <-- This is our connection to the database!

// 2. Create an instance of the express app
const app = express();
const PORT = 5000;
// 3. Add middleware
app.use(cors()); // Lets our React app talk to our server
app.use(express.json()); // Lets our server understand JSON data

//================================================
// API ENDPOINTS (OUR ROUTES)
//================================================

// This is our test route
app.get("/", (req, res) => {
  res.json({ message: "Hello from the Alibag Voyager API!" });
});

// --- GET ALL PLACES ---
// This route will get all the places from our database
app.get("/api/places", async (req, res) => {
  try {
    console.log("Request received for /api/places");

    // We use pool.query to send a raw SQL command to our database
    // 'SELECT * FROM places' is the SQL to get everything from that table
    const result = await pool.query("SELECT * FROM places");

    // The database returns the data in the 'rows' property
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting all places:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// --- GET ONE PLACE (with its reviews) ---
// This route gets a *single* place by its ID
app.get("/api/places/:id", async (req, res) => {
  try {
    // req.params.id gets the ':id' from the URL
    const { id } = req.params;
    console.log(`Request received for /api/places/${id}`);

    // --- We will run TWO queries to get all our data ---

    // Query 1: Get the place itself
    // We use a "parameterized query" ($1) to prevent SQL Injection.
    // [id] is the array of values that will safely replace $1.
    const placeQuery = "SELECT * FROM places WHERE place_id = $1";
    const placeResult = await pool.query(placeQuery, [id]);

    // Check if we found a place
    if (placeResult.rows.length === 0) {
      return res.status(404).json({ error: "Place not found." });
    }

    // Query 2: Get all reviews for that place
    const reviewsQuery = "SELECT * FROM reviews WHERE place_id = $1";
    const reviewsResult = await pool.query(reviewsQuery, [id]);

    // --- Combine the results ---
    const place = placeResult.rows[0]; // The place is the first (and only) row
    place.reviews = reviewsResult.rows; // Attach the list of reviews to the place

    // Send the final combined object back
    res.json(place);
  } catch (error) {
    console.error("Error getting one place:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
