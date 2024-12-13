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
  