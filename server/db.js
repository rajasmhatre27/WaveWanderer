import pkg from "pg";
import dotenv from "dotenv";
// Load environment variables immediately
dotenv.config();

const { Pool } = pkg;

// Pool configuration using the separate environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

  // FINAL SSL FIX: Explicitly requiring SSL and rejecting local authorization
  // This is the robust setting needed for cloud providers like Supabase.
  ssl: {
    rejectUnauthorized: false,
  },

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// IMPORTANT: Keep the error handler
pool.on("error", (err, client) => {
  // Log the error but DO NOT throw or crash the process.
  console.error(
    "FATAL DB ERROR: Unexpected termination on idle client in pool:",
    err.stack
  );
});

// --- NEW RESILIENCE CHECK ---
// Test the connection immediately to wake up the pooler and check for errors.
pool
  .query("SELECT 1")
  .then(() => {
    console.log(`✅ Database connection successfully tested.`);
    console.log(
      `✅ Database Pool initialized. Host: ${process.env.DB_HOST} (SSL enforced)`
    );
  })
  .catch((err) => {
    // If this fails, the error is critical and likely password/permission related.
    console.error(
      "❌ CRITICAL: Initial database connection failed.",
      err.message
    );
    console.error(
      "Please check your DB_USER, DB_PASSWORD, and ensure the pooler role has access to your tables."
    );
  });

export default pool;
