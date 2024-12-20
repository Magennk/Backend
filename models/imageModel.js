const path = require("path");

// Model to generate file paths for owner and dog images
exports.getOwnerImagePath = (email) => {
  // Generates the image path for owner based on their email
  return path.resolve(
    __dirname,
    "../../Frontend/barkbuddy-web/public/data/owners",
    `${email}.jpeg`
  );
};

exports.getDogImagePath = (dogId) => {
  // Generates the image path for dog based on their ID
  return path.resolve(
    __dirname,
    "../../Frontend/barkbuddy-web/public/data/images",
    `${dogId}.jpeg`
  );
};
