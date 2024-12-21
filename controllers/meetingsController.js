const meetingsModel = require('../models/meetingsModel');

exports.getMeetings = async (req, res) => {
  try {
    const email = req.query.email; // Extract email from query parameter
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const meetings = await meetingsModel.getMeetingsByUser(email); // Fetch meetings
    const currentDateTime = new Date(); // Current datetime for comparison

    // Separate meetings into upcoming and past
    const upcomingMeetings = [];
    const pastMeetings = [];

    meetings.forEach((meeting) => {
      const meetingDateTime = new Date(meeting.datetime); // Use the combined datetime field

      const meetingData = {
        date: meetingDateTime.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: meetingDateTime.toISOString().split('T')[1].slice(0, 8), // Format as HH:mm:ss
        location: meeting.location,
        subject: meeting.subject,
        meeting_id: meeting.meeting_id,
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
    console.error('Error fetching meetings:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a meeting by meeting_id
exports.deleteMeeting = async (req, res) => {
  try {
    const { meeting_id } = req.params; // Extract meeting_id from the URL parameter

    // Validate meeting_id
    if (!meeting_id) {
      return res.status(400).json({ message: 'Meeting ID is required' });
    }

    console.log('Meeting ID to delete:', meeting_id);

    // Check if the meeting exists
    const meetingExists = await meetingsModel.checkMeetingExists(meeting_id);
    if (!meetingExists) {
      console.log('Meeting not found:', meeting_id);
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Delete the meeting
    const isDeleted = await meetingsModel.deleteMeetingById(meeting_id);
    if (!isDeleted) {
      return res.status(500).json({ message: 'Failed to delete the meeting' });
    }

    // Success response
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
