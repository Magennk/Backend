const meetingsModel = require('../models/meetingsModel');

exports.getMeetings = async (req, res) => {
  try {
    const email = req.query.email; // Extract email from query parameter
    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const meetings = await meetingsModel.getMeetingsByUser(email); // Fetch meetings
    const currentDateTime = new Date(); // Current datetime for comparison

    // Separate meetings into upcoming and past
    const upcomingMeetings = [];
    const pastMeetings = [];

    meetings.forEach((meeting) => {
      // Combine date and time into a single Date object
      const meetingDateTime = new Date(
        meeting.date.toISOString().split("T")[0] + "T" + meeting.hour
      );

      const meetingData = {
        date: meeting.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        time: meeting.hour, // Use the time from the database
        location: meeting.location,
        subject: meeting.subject,
        buddyNameOrganizer: meeting.buddynameorganizer,
        buddyNameParticipant: meeting.buddynameparticipant,
        ownerNameOrganizer: meeting.ownernameorganizer,
        ownerNameParticipant: meeting.ownernameparticipant,
      };

      if (meetingDateTime >= currentDateTime) {
        upcomingMeetings.push(meetingData);
      } else {
        pastMeetings.push(meetingData);
      }
    });

    res.status(200).json({ upcomingMeetings, pastMeetings });
  } catch (error) {
    console.error("Error fetching meetings:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

