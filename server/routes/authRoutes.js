import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = Router();

// --- REGISTER ROUTE (Updated) ---
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // FIX 1: Humne 'role' ko 'RETURNING' mein add kiya
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email, role",
      [email, passwordHash]
    );

    // FIX 2: Humne 'role' ko naye Token mein add kiya
    const token = jwt.sign(
      { id: newUser.rows[0].user_id, role: newUser.rows[0].role }, // <-- YEH HAI CHANGE
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error in registration:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// --- LOGIN ROUTE (Updated) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // FIX 3: Humne 'role' ko naye Token mein add kiya
    const token = jwt.sign(
      { id: user.rows[0].user_id, role: user.rows[0].role }, // <-- YEH HAI CHANGE
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
