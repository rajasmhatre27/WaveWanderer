import jwt from "jsonwebtoken";
import pool from "../db.js";
import "dotenv/config";

// Yeh Gatekeeper check karega ki user 'admin' hai ya nahi
const adminMiddleware = async (req, res, next) => {
  // 1. Pehle, check karo ki user logged-in hai ya nahi
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // 2. Token ko verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user mein ab { id: 5 } aa gaya

    // 3. (NAYA STEP) Database se user ka 'role' fetch karo
    const user = await pool.query("SELECT role FROM users WHERE user_id = $1", [
      req.user.id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Check karo ki role 'admin' hai ya nahi
    if (user.rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden. Admin access required." });
    }

    // 5. User admin hai! Request ko aage jaane do.
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

export default adminMiddleware;
