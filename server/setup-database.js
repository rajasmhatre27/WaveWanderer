import fs from "fs"; // Node.js File System module
import pool from "./db.js"; // Our database connection pool

async function setupDatabase() {
  try {
    // 1. Read the .sql file
    // We use 'fs.readFileSync' to read the file's contents into a string
    const sql = fs.readFileSync("database.sql", "utf8");

    // 2. Send the SQL string to the database
    // pool.query will execute all the SQL commands in the file
    console.log("Running database setup script...");
    await pool.query(sql);

    console.log("✅ Database tables created successfully!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
  } finally {
    // 3. Close the connection pool so the script can exit
    await pool.end();
  }
}

// Run the function
setupDatabase();
