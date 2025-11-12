import fs from "fs"; // Node.js File System module
import pool from "./db.js"; // Our database connection pool

async function seedDatabase() {
  try {
    // 1. Read the seed.sql file
    const sql = fs.readFileSync("seed.sql", "utf8");

    // 2. Send the SQL string to the database
    console.log("Running database seed script...");
    await pool.query(sql);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  } finally {
    // 3. Close the connection pool
    await pool.end();
  }
}

// Run the function
seedDatabase();
