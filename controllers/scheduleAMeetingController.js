const scheduleMeetingModel = require('../models/scheduleAMeetingModel');

exports.scheduleMeeting = async (req, res) => {
  console.log("Request Body Received:", req.body);
  try {
    const { buddyName, date, time, location, subject, ownerEmail1, ownerEmail2 } = req.body;

    // Validate request payload
    if (!buddyName || !date || !time || !location || !subject || !ownerEmail1 || !ownerEmail2) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Call the model to insert the meeting into the database
    const newMeeting = await scheduleMeetingModel.scheduleMeeting({
      buddyName,
      date,
      time,
      location,
      subject,
      ownerEmail1,
      ownerEmail2,
    });

    res.status(201).json({ message: "Meeting scheduled successfully", meeting: newMeeting });
  } catch (error) {
    console.error("Error scheduling meeting:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
