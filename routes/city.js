const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// Define API endpoint for fetching cities
router.get('/get-cities', cityController.getCities);

module.exports = router;
