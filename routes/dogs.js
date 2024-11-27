const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogsController');

// Define API Endpoints
router.get('/', dogsController.getAllDogs); // Fetch all dogs
router.get('/:id', dogsController.getDogById); // Fetch a single dog by ID

module.exports = router;
