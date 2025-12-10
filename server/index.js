import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./db.js";

// --- Hamare Route Managers ko Import karo ---
import placeRoutes from "./routes/places.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviews.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import weatherRoutes from "./routes/weather.js"; // Weather route import
import shopRoutes from "./routes/shopRoutes.js"; // Weather route import

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Setup ---
// Fix CORS: Allow requests from frontend domains
const allowedOrigins = [
  "http://localhost:5173", // Local frontend development
  "http://localhost:3000", // Another common local port
  "https://wavewanderer.vercel.app", // Aapka Vercel Frontend (Example)
  // Agar aapka Vercel URL alag hai, toh use yahan add karein
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        // Vercel previews ke liye dynamic allow (optional, but helpful)
        if (origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies/authorization headers
  })
);

app.use(express.json());

// --- API Routes ---
app.use("/api/places", placeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/weather", weatherRoutes); // Weather route use
app.use('/api/shop', shopRoutes);
// Basic health check route
app.get("/", (req, res) => {
  res.send("WaveWanderer Backend is running!");
});

// --- Server ko Chalu Karo ---
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
