import fs from "fs"; // Node.js File System module, used to read files
import pool from "./db.js"; // Our database connection pool from db.js

export default async function setupDatabase() {
  try {
    // 1. Read the database.sql file
    // We use 'fs.readFileSync' to read the file's contents into a string
    // 'utf8' is the encoding (how to read the text)
    const sql = fs.readFileSync("database.sql", "utf8");

    // 2. Send the entire SQL string to the database
    // The pool.query function can execute all the SQL commands in the file at once
    console.log("Running database setup script...");
    await pool.query(sql);

    // If no errors, the tables were created!
    console.log("✅ Database tables created successfully!");
  } catch (error) {
    // If something goes wrong (e.g., a syntax error in your SQL)
    console.error("❌ Error setting up database:", error.message);
  } finally {
    // 3. Always close the connection pool at the end
    // This allows the Node.js script to exit gracefully
    await pool.end();
  }
}

// Run the function we just defined
setupDatabase();
