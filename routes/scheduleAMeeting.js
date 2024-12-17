const express = require('express');
const router = express.Router();
const scheduleAMeetingController = require('../controllers/scheduleAMeetingController');

// Define route to schedule a new meeting
router.post('/schedule-meeting', scheduleAMeetingController.scheduleMeeting);

module.exports = router;
