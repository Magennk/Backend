const db = require('../db/db');

// Fetch upcoming and past meetings
exports.getMeetingsByUser = async (email) => {
    const query = `
      SELECT 
        m.date,
        m.hour,
        m.location,
        m.subject,
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
      ORDER BY m.date ASC, m.hour ASC;
    `;
  
    const result = await db.query(query, [email]);
    return result.rows;
  };
  
