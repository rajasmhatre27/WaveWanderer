// 1. 'pg' (node-postgres) library ko import karo
import pg from "pg";

// 2. 'dotenv' ko import karo taaki hum .env file se password padh sakein
//    'dotenv/config' likhne se .env file ka data automatically load ho jaata hai
import "dotenv/config";

// 3. Hum 'pg' library se 'Pool' class ko nikaal rahe hain
const { Pool } = pg;

// 4. YEH HAI SABSE IMPORTANT LINE: Hum pool ko define kar rahe hain
//    Hum 'Pool' class ka ek naya object bana rahe hain
const pool = new Pool({
  // Yeh hamare .env file se database ka URL padhta hai
  connectionString: process.env.DATABASE_URL,

  // Yeh line Supabase (jo AWS par chalta hai) ke liye zaroori hai
  // Yeh kehta hai ki SSL connection ko allow karo
  ssl: {
    rejectUnauthorized: false,
  },
});

// 5. Is 'pool' ko export karo taaki hamari doosri files (jaise run-seed.js)
//    isey import karke istemaal kar sakein.
export default pool;
