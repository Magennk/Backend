const dogsModel = require('../models/dogsModel');

exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await dogsModel.getAllDogs();
    const formattedDogs = dogs.map((dog) => ({
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      age: dog.age,
      sex: dog.sex,
      region: dog.region,
      isvaccinated: dog.isvaccinated,
      isgoodwithkids: dog.isgoodwithkids,
      isgoodwithanimals: dog.isgoodwithanimals,
      isinrestrictedbreedscategory: dog.isinrestrictedbreedscategory,
      description: dog.description,
      energylevel: dog.energylevel,
      image: `/data/images/${dog.id}.jpeg`, // Assuming image path based on dog ID
      owner: {
        firstname: dog.firstname,
        lastname: dog.lastname,
        email: dog.email,
        gender: dog.gender,
        age: dog.ownerage,
        city: dog.city,
        image: dog.ownerimage,
      },
    }));
    res.status(200).json(formattedDogs);
  } catch (error) {
    console.error('Error in getAllDogs:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


exports.getDogById = async (req, res) => {
  try {
    const dog = await dogsModel.getDogById(req.params.id);
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    res.status(200).json(dog);
  } catch (error) {
    console.error('Error in getDogById:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


exports.getNotFriendsDogsAndOwners = async (req, res) => {
  try {
    // Extract the query parameter for email
    const loggedInUserEmail = req.query.email;

    // Log the extracted email for debugging
    console.log('Received email:', loggedInUserEmail);

    if (!loggedInUserEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    // Call the model function to fetch the data
    const notFriendsDogsAndOwners = await dogsModel.getNotFriendsDogsAndOwners(loggedInUserEmail);

    // Respond with the data
    res.status(200).json(notFriendsDogsAndOwners);
  } catch (error) {
    // Log the error for debugging
    console.error('Error in getNotFriendsDogsAndOwners:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//Get a Specific Dog Without Its Owner’s Data.
exports.getDogWithoutOwner = async (req, res) => {
  try {
    const { id } = req.params; // Extract dogId from URL parameters

    if (!id) {
      return res.status(400).json({ message: 'Dog ID is required' });
    }

    const dog = await dogsModel.getDogWithoutOwner(id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    res.status(200).json(dog);
  } catch (error) {
    console.error('Error in getDogWithoutOwner:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Controller function to handle requests for fetching an owner without their dogs
exports.getOwnerWithoutDog = async (req, res) => {
  try {
    const { email } = req.params; // Extract the owner email from the URL parameters

    // Check if email is provided, otherwise return an error
    if (!email) {
      return res.status(400).json({ message: 'Owner email is required' });
    }

    // Call the model function to fetch the owner details
    const owner = await dogsModel.getOwnerWithoutDog(email);

    // If no owner is found, return a 404 error
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // If everything is fine, return the owner details in the response
    res.status(200).json(owner);
  } catch (error) {
    // Log the error and return a server error message
    console.error('Error in getOwnerWithoutDog:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Controller function to handle requests for fetching a dog and its owner
exports.getDogAndOwner = async (req, res) => {
  try {
    const { id } = req.params; // Extract the dog ID from the URL parameters

    // Check if the dog ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Dog ID is required' });
    }

    // Call the model function to fetch the dog's details along with the owner
    const data = await dogsModel.getDogAndOwner(id);

    // If no data is found, return a 404 error
    if (!data) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Format the response to match the expected structure
    const dogAndOwner = {
      id: data.id,
      name: data.dog_name,
      breed: data.breed,
      age: data.dog_age,
      sex: data.dog_sex,
      region: data.dog_region,
      isvaccinated: data.isvaccinated,
      isgoodwithkids: data.isgoodwithkids,
      isgoodwithanimals: data.isgoodwithanimals,
      isinrestrictedbreedscategory: data.isinrestrictedbreedscategory,
      description: data.dog_description,
      energylevel: data.energylevel,
      image: data.dog_image || `/data/images/${data.id}.jpeg`, // Use default path if image is missing
      owner: {
        firstname: data.owner_firstname,
        lastname: data.owner_lastname,
        email: data.owner_email,
        gender: data.owner_gender,
        age: data.owner_age,
        city: data.owner_city,
        image: data.owner_image || `/data/owners/${data.owner_email}.jpeg`, // Use default path if image is missing
      },
    };

    // Return the formatted response
    res.status(200).json(dogAndOwner);
  } catch (error) {
    // Log the error and return a server error message
    console.error('Error in getDogAndOwner:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get friends - dogs and owners
exports.getFriendsDogsAndOwners = async (req, res) => {
  try {
    const loggedInUserEmail = req.query.email; // Get email from query parameter

    if (!loggedInUserEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const friendsDogsAndOwners = await dogsModel.getFriendsDogsAndOwners(loggedInUserEmail);
    res.status(200).json(friendsDogsAndOwners);
  } catch (error) {
    console.error('Error in getFriendsDogsAndOwners:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Get logged in owner's information and dog's:
exports.getOwnerAndDog = async (req, res) => {
  try {
    const loggedInUserEmail = req.query.email; // Get email from query parameter

    if (!loggedInUserEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const ownerAndDogData = await dogsModel.getOwnerAndDog(loggedInUserEmail);

    if (!ownerAndDogData || ownerAndDogData.length === 0) {
      return res.status(404).json({ message: "No owner or dog found for the given email" });
    }

    // Transforming the database result into the required JSON structure
    const formattedResponse = ownerAndDogData.map((dog) => ({
      id: dog.id,
      name: dog.dog_name,
      breed: dog.breed,
      age: dog.dog_age,
      sex: dog.dog_sex,
      region: dog.dog_region,
      isvaccinated: dog.isvaccinated,
      isgoodwithkids: dog.isgoodwithkids,
      isgoodwithanimals: dog.isgoodwithanimals,
      isinrestrictedbreedscategory: dog.isinrestrictedbreedscategory,
      description: dog.dog_description,
      energylevel: dog.energylevel,
      image: dog.dog_image,
      owner: {
        firstname: dog.owner_firstname,
        lastname: dog.owner_lastname,
        email: dog.owner_email,
        gender: dog.owner_gender,
        age: dog.owner_age,
        city: dog.owner_city,
        image: dog.owner_image,
      },
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error in getOwnerAndDog:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


