const { google } = require('googleapis');

exports.addEventToGoogleCalendar = async (req, res) => {
  try {
    const { token, meetingDetails } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    if (!meetingDetails) {
      return res.status(400).json({ message: 'Meeting details are required' });
    }

    // Initialize Google Calendar API
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create event data
    const event = {
      summary: `BarkBuddy Meeting - ${meetingDetails.subject}`,
      description: meetingDetails.description,
      location: meetingDetails.location,
      start: {
        dateTime: meetingDetails.startTime, // ISO 8601 format
        timeZone: 'Asia/Jerusalem',
      },
      end: {
        dateTime: meetingDetails.endTime, // ISO 8601 format
        timeZone: 'Asia/Jerusalem',
      },
      attendees: meetingDetails.attendees.map((email) => ({ email })),
    };

    // Insert event into the user's Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    res.status(200).json({
      message: 'Meeting added to Google Calendar successfully!',
      event: response.data,
    });
  } catch (error) {
    console.error('Error adding meeting to Google Calendar:', error.message);
    res
      .status(500)
      .json({ message: 'Failed to add meeting to Google Calendar' });
  }
};
