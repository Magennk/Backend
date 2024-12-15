const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetingsController');

// Define API endpoint for fetching meetings
router.get('/get-my-meetings', meetingsController.getMeetings);
router.delete('/delete-meeting/:meeting_id', meetingsController.deleteMeeting);


module.exports = router;


