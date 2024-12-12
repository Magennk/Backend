const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogsController');

// Define API Endpoints
// dogs
router.get('/', dogsController.getAllDogs); // Fetch all dogs
router.get('/not-friends-dogs-and-owners', dogsController.getNotFriendsDogsAndOwners); // Fetch all dogs and owners excluding friend and logged-in user
router.get('/friends-dogs-and-owners', dogsController.getFriendsDogsAndOwners); // Fetch all dogs and owners that are my-friends (logged-in user)
router.get('/owner-and-dog', dogsController.getOwnerAndDog); // Route to get the logged-in owner's information
router.get('/dog/:id/without-owner', dogsController.getDogWithoutOwner); // Get a Specific Dog Without Its Owner’s Data.
router.get('/:id', dogsController.getDogById); // Fetch a single dog by ID

// owners
router.get('/owner/:email/without-dog', dogsController.getOwnerWithoutDog); // Route to get a specific owner without their dogs
router.get('/dog/:id/with-owner', dogsController.getDogAndOwner); // Route to get a specific dog and its owner






module.exports = router;
