const db = require("../db/db"); // Import the database connection

// Validate user credentials
exports.validateUser = async (email, password) => {
  const query = `
    SELECT email, firstname, lastname
    FROM public.owner
    WHERE email = $1 AND password = $2
  `;
  const result = await db.query(query, [email, password]); // Query database with email and password
  return result.rows[0]; // Return the first row if a match is found
};
