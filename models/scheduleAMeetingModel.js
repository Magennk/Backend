const db = require('../db/db');

// Create a new meeting
exports.scheduleMeeting = async ({ buddyName, date, time, location, subject, ownerEmail1, ownerEmail2 }) => {
  const query = `
    INSERT INTO public.meeting (date, hour, location, subject, owneremail1, owneremail2)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [date, time, location, subject, ownerEmail1, ownerEmail2];
  const result = await db.query(query, values);
  return result.rows[0]; // Return the newly inserted meeting
};
