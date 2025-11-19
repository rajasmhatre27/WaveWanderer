import { Router } from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js"; // <-- Hamara naya "Gatekeeper"

const router = Router();

// --- NAYA REVIEW POST KARO ---
// Path: POST /api/reviews
// Yeh ek "PROTECTED" route hai
router.post("/", authMiddleware, async (req, res) => {
  // Yeh function tabhi chalega jab 'authMiddleware' (Gatekeeper) "pass" karega

  try {
    // 1. 'authMiddleware' ne humein req.user.id diya (Token se)
    const userId = req.user.id;

    // 2. User ke form se 'place_id', 'rating', 'comment' lo
    const { place_id, rating, comment } = req.body;

    if (!place_id || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 3. Naye review ko database mein daalo
    const newReview = await pool.query(
      "INSERT INTO reviews (place_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [place_id, userId, rating, comment]
    );

    // 4. Naya review user ko vapas bhejo
    res.status(201).json(newReview.rows[0]);
  } catch (error) {
    console.error("Error posting review:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
