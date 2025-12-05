import { Router } from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// 1. GET /api/favorites - Get all places favorited by the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Join user_favorites with places to get full details of the favorited places
    const result = await pool.query(
      `
            SELECT p.* FROM user_favorites uf
            JOIN places p ON uf.place_id = p.place_id
            WHERE uf.user_id = $1
            ORDER BY uf.favorited_at DESC
        `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching favorites." });
  }
});

// 2. POST /api/favorites/add - Add a place to favorites
router.post("/add", authMiddleware, async (req, res) => {
  const { placeId } = req.body;
  const userId = req.user.id;

  if (!placeId) {
    return res.status(400).json({ message: "Place ID is required." });
  }

  try {
    // Use ON CONFLICT DO NOTHING to prevent errors if the user tries to favorite it twice
    const result = await pool.query(
      `
            INSERT INTO user_favorites (user_id, place_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, place_id) DO NOTHING
            RETURNING *
        `,
      [userId, placeId]
    );

    if (result.rowCount === 0) {
      return res
        .status(200)
        .json({ message: "Place already favorited.", isFavorite: true });
    }

    res
      .status(201)
      .json({ message: "Place added to favorites.", isFavorite: true });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res
      .status(500)
      .json({ message: "Internal server error while adding favorite." });
  }
});

// 3. DELETE /api/favorites/remove - Remove a place from favorites
router.delete("/remove/:placeId", authMiddleware, async (req, res) => {
  const { placeId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
            DELETE FROM user_favorites 
            WHERE user_id = $1 AND place_id = $2
            RETURNING *
        `,
      [userId, placeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    res
      .status(200)
      .json({ message: "Place removed from favorites.", isFavorite: false });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res
      .status(500)
      .json({ message: "Internal server error while removing favorite." });
  }
});

export default router;
