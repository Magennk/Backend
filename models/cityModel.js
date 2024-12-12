const db = require('../db/db');

// Fetch all cities from the database
exports.getAllCities = async () => {
  const query = `
    SELECT name
    FROM public.city
    ORDER BY name ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};
