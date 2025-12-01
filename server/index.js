// 1. Import our tools
import express from "express";
import cors from "cors";
import "dotenv/config"; // .env file ko load karne ke liye
import pool from "./db.js"; // <-- Yahaan './' zaroori hai

// --- Hamare Route Managers ko Import karo ---
// Yahaan './' zaroori hai (Yeh aapka fix hai)
import placeRoutes from "./routes/places.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import weatherRoutes from "./routes/weather.js";

// 2. Create an instance of the express app
const app = express();
const PORT = process.env.PORT || 10000;

// 3. Add middleware
// Update this line to include specific origins
app.use(cors({
  origin: [
    'https://wavewander.vercel.app',  // Your future Vercel frontend
    'http://localhost:5173',          // Local development
    'https://wavewander-backend.onrender.com'  // Your Render backend
  ],
  credentials: true
})); // Lets our React app talk to our server // Lets our React app talk to our server
app.use(express.json()); // Lets our server understand JSON data

// 4. API Routes (Manager ko department dena)
app.use("/api/places", placeRoutes);
app.use("/api/auth", authRoutes); // Path '/api/auth' hai
app.use("/api/upload", uploadRoutes);
app.use("/api/weather", weatherRoutes);

// 5. Server ko Chalu Karo
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
