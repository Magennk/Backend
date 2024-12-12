const cityModel = require('../models/cityModel');

exports.getCities = async (req, res) => {
  try {
    // Fetch all cities from the model
    const cities = await cityModel.getAllCities();

    // Format the response if necessary (e.g., map cities into an array of names)
    const cityList = cities.map((city) => city.name);

    res.status(200).json({ cities: cityList });
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
