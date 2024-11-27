const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Add this if you're using a hosted database with SSL (e.g., Heroku)
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};