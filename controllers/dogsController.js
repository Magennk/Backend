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
    res.status(500).json({ message: 'Server Error' });
  }
};
