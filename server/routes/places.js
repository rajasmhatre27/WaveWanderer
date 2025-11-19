import express from "express";
import pool from "../db.js";
import adminMiddleware from "../middleware/adminMiddleware.js"; // <-- NAYA ADMIN GATEKEEPER

const router = express.Router();

// --- GET ALL PLACES (Yeh public hai) ---
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM places");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting all places:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// --- GET ONE PLACE (Yeh public hai) ---
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const placeQuery = "SELECT * FROM places WHERE place_id = $1";
    const placeResult = await pool.query(placeQuery, [id]);

    if (placeResult.rows.length === 0) {
      return res.status(404).json({ error: "Place not found." });
    }

    const reviewsQuery = "SELECT * FROM reviews WHERE place_id = $1";
    const reviewsResult = await pool.query(reviewsQuery, [id]);

    const place = placeResult.rows[0];
    place.reviews = reviewsResult.rows;

    res.json(place);
  } catch (error) {
    console.error("Error getting one place:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// --- (NAYA FEATURE) CREATE A NEW PLACE (Yeh *sirf* Admin kar sakta hai) ---
// Path: POST /api/places/
router.post("/", adminMiddleware, async (req, res) => {
  // Yeh code tabhi chalega jab 'adminMiddleware' (Gatekeeper) "pass" karega

  try {
    const {
      name,
      description,
      location,
      type,
      image_url,
      latitude,
      longitude,
    } = req.body;

    // Basic validation
    if (!name || !type || !location) {
      return res
        .status(400)
        .json({ message: "Name, type, and location are required." });
    }

    // Naye place ko database mein daalo
    const newPlace = await pool.query(
      `INSERT INTO places (name, description, location, type, image_url, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, location, type, image_url, latitude, longitude]
    );

    res.status(201).json(newPlace.rows[0]);
  } catch (error) {
    console.error("Error creating place:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
