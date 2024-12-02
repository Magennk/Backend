const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

// Configure the database connection
const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432, // Default PostgreSQL port
});

// API endpoint to fetch meetings
app.get('/api/meetings', async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    // Query for upcoming and past meetings
    const result = await pool.query(`
      SELECT 
        m.date, 
        m.hour, 
        m.location, 
        m.subject, 
        d.name AS buddyName 
      FROM public.meeting AS m
      JOIN public.owner AS o ON 
        (o.email = m.owneremail1 OR o.email = m.owneremail2)
      JOIN public.belongs_to AS bt ON bt.owneremail = o.email
      JOIN public.dog AS d ON d.dogid = bt.dogid
      WHERE o.email <> $1
    `, ['current_user_email']); // Replace with the current user's email dynamically

    const meetings = result.rows;

    // Separate upcoming and past meetings
    const upcomingMeetings = [];
    const pastMeetings = [];
    const currentDate = new Date();

    meetings.forEach((meeting) => {
      const meetingDate = new Date(`${meeting.date}T${meeting.hour}`);
      if (meetingDate >= currentDate) {
        upcomingMeetings.push(meeting);
      } else {
        pastMeetings.push(meeting);
      }
    });

    res.json({ upcomingMeetings, pastMeetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
