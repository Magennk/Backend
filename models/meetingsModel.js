const db = require('../db/db');

// Fetch upcoming and past meetings
exports.getMeetingsByUser = async (email) => {
  const query = `
      SELECT 
        (m.date + m.hour)::timestamp AT TIME ZONE 'UTC' AS datetime,
        m.location,
        m.subject,
        m.meeting_id,
        d1.name AS buddyNameOrganizer,
        d2.name AS buddyNameParticipant,
        o1.firstname AS ownerNameOrganizer,
        o2.firstname AS ownerNameParticipant
      FROM public.meeting m
      JOIN public.owner o1 ON m.owneremail1 = o1.email
      JOIN public.owner o2 ON m.owneremail2 = o2.email
      JOIN public.belongs_to bt1 ON o1.email = bt1.owneremail
      JOIN public.belongs_to bt2 ON o2.email = bt2.owneremail
      JOIN public.dog d1 ON bt1.dogid = d1.dogid
      JOIN public.dog d2 ON bt2.dogid = d2.dogid
      WHERE m.owneremail1 = $1 OR m.owneremail2 = $1
      ORDER BY datetime ASC;
  `;

  const result = await db.query(query, [email]);
  return result.rows;
};

// Check if a meeting exists by meeting_id
exports.checkMeetingExists = async (meeting_id) => {
  const query = `SELECT * FROM public.meeting WHERE meeting_id = $1`;
  const result = await db.query(query, [meeting_id]);
  return result.rowCount > 0; // Return true if the meeting exists, false otherwise
};

// Delete a meeting by meeting_id
exports.deleteMeetingById = async (meeting_id) => {
  const query = `DELETE FROM public.meeting WHERE meeting_id = $1 RETURNING *`;
  const result = await db.query(query, [meeting_id]);
  return result.rowCount > 0; // Return true if a row was deleted, false otherwise
};
