const dogsModel = require('../models/dogsModel');

exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await dogsModel.getAllDogs();
    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
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
