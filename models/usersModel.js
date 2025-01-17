const db = require("../db/db"); // Import the database connection

// Validate user credentials
// Moslty used in Login
exports.validateUser = async (email, password) => {
  const query = `
    SELECT email, firstname, lastname
    FROM public.owner
    WHERE email = $1 AND password = $2
  `;
  const result = await db.query(query, [email, password]); // Query database with email and password
  return result.rows[0]; // Return the first row if a match is found
};

// Update owner information, used in "MyProfile" when edit the owner's information
// Can only edit firstname, lastname, city.
exports.updateOwner = async (email, updatedData) => {
    const query = `
      UPDATE public.owner
      SET 
        firstname = $1,
        lastname = $2,
        city = $3
      WHERE email = $4
      RETURNING email, firstname, lastname, city; -- Return updated owner details
    `;
    const values = [
      updatedData.firstname,
      updatedData.lastname,
      updatedData.city,
      email,
    ];
  
    const result = await db.query(query, values); // Execute the update query
    return result.rows[0]; // Return the updated owner information
  };
  
  // Check if an email already exists in the database
exports.checkEmailExists = async (email) => {
  const query = `
    SELECT email 
    FROM public.owner 
    WHERE email = $1;
  `;
  const result = await db.query(query, [email]); // Query the database
  return result.rows.length > 0; // Return true if email exists
};


// Function to register a new owner in the database
exports.registerOwner = async (ownerData) => {
  const query = `
    INSERT INTO public.owner (email, firstname, lastname, city, password, dateofbirth, gender, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING email, firstname, lastname, city, gender, dateofbirth, image;
  `;
  const values = [
    ownerData.email,
    ownerData.firstName, // Adjust case for field name
    ownerData.lastName,  // Adjust case for field name
    ownerData.city,
    ownerData.password,  // Add password for registration
    ownerData.dob,
    ownerData.gender,
    `/data/owners/${ownerData.email}.jpeg` || null, // Handle cases where image is empty
  ];
  const result = await db.query(query, values); // Execute query
  return result.rows[0];
};

