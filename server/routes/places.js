import express from "express";
import pool from "../db.js"; // <-- Database connection import karo (path par dhyaan do '../')

// 1. Naya Router banakar "app" ki jagah use karo
const router = express.Router();

// --- GET ALL PLACES ---
// Path: GET /api/places/
// (Note: '/api/places' part 'index.js' mein hai, isliye yahaan sirf '/' likha hai)
router.get("/", async (req, res) => {
  try {
    // console.log('Request received for all places'); // Aap isey chalu ya band kar sakte hain

    // Database se saare places laao
    const result = await pool.query("SELECT * FROM places");

    // Data ko JSON format mein vapas bhejo
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting all places:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// --- GET ONE PLACE (with its reviews) ---
// Path: GET /api/places/1 (ya 2, 3, etc.)
// (Yahaan '/:id' likha hai)
router.get("/:id", async (req, res) => {
  try {
    // URL se 'id' ko nikalo (e.g., "1")
    const { id } = req.params;
    // console.log(`Request received for place with id: ${id}`);

    // --- Hum 2 alag queries chalayenge ---

    // Query 1: Uss ID ka place dhoondo
    const placeQuery = "SELECT * FROM places WHERE place_id = $1";
    const placeResult = await pool.query(placeQuery, [id]);

    // Agar place nahi mila, toh 404 error bhejo
    if (placeResult.rows.length === 0) {
      return res.status(404).json({ error: "Place not found." });
    }

    // Query 2: Uss place_id ke saare reviews dhoondo
    const reviewsQuery = "SELECT * FROM reviews WHERE place_id = $1";
    const reviewsResult = await pool.query(reviewsQuery, [id]);

    // --- Dono results ko combine karo ---
    const place = placeResult.rows[0]; // place object
    place.reviews = reviewsResult.rows; // place object ke andar ek naya 'reviews' array banao

    // Poora combined object (place + reviews) JSON format mein bhejo
    res.json(place);
  } catch (error) {
    console.error("Error getting one place:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// 2. Router ko export karo taaki 'index.js' usey import kar sake
export default router;
