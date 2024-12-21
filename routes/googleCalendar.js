const express = require('express');
const googleCalendarController = require('../controllers/googleCalendarController');

const router = express.Router();

// Route for adding an event to Google Calendar
router.post(
  '/add-to-calendar',
  googleCalendarController.addEventToGoogleCalendar
);

module.exports = router;
