const db = require('../db/db');

exports.getAllDogs = async () => {
  const query = `
    SELECT 
      d.dogid AS id,
      d.name,
      d.breed,
      EXTRACT(YEAR FROM CURRENT_DATE) - d.yearofbirth AS age,
      d.sex,
      d.region,
      d.isvaccinated,
      d.isgoodwithkids,
      d.isgoodwithanimals,
      d.isinrestrictedbreedscategory,
      d.description,
      d.energylevel,
      o.firstname,
      o.lastname,
      o.email,
      o.gender,
      EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS ownerage,
      o.city,
      o.image AS ownerimage
    FROM 
      public.dog d
    JOIN 
      public.belongs_to bt ON d.dogid = bt.dogid
    JOIN 
      public.owner o ON bt.owneremail = o.email
    ORDER BY 
      d.dogid ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};

exports.getDogById = async (id) => {
  const query = `
    SELECT 
      d.dogid AS id,
      d.name,
      d.breed,
      EXTRACT(YEAR FROM CURRENT_DATE) - d.yearofbirth AS age,
      d.sex,
      d.region,
      d.isvaccinated,
      d.isgoodwithkids,
      d.isgoodwithanimals,
      d.isinrestrictedbreedscategory,
      d.description,
      d.energylevel,
      o.firstname,
      o.lastname,
      o.email,
      o.gender,
      EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS ownerage,
      o.city,
      o.image AS ownerimage
    FROM 
      public.dog d
    JOIN 
      public.belongs_to bt ON d.dogid = bt.dogid
    JOIN 
      public.owner o ON bt.owneremail = o.email
    WHERE 
      d.dogid = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

// retrieve all dogs and their owners, excluding:
// The logged-in user’s data.
// The logged-in user’s friends (based on the communication table).
// The logged-in user's friends request (that he sent).
exports.getNotFriendsDogsAndOwners = async (loggedInUserEmail) => {
  const query = `
    SELECT 
        d.dogid AS id,
        d.name,
        d.breed,
        EXTRACT(YEAR FROM CURRENT_DATE) - d.yearofbirth AS age,
        d.sex,
        d.region,
        d.isvaccinated,
        d.isgoodwithkids,
        d.isgoodwithanimals,
        d.isinrestrictedbreedscategory,
        d.description,
        d.energylevel,
        d.image,
        o.firstname,
        o.lastname,
        o.email,
        o.gender,
        EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS ownerage,
        o.city,
        o.image AS ownerimage
    FROM 
        public.dog d
    JOIN 
        public.belongs_to bt ON d.dogid = bt.dogid
    JOIN 
        public.owner o ON bt.owneremail = o.email
    LEFT JOIN 
        public.communication c 
        ON (c.owneremail1 = o.email AND c.owneremail2 = $1) 
        OR (c.owneremail2 = o.email AND c.owneremail1 = $1)
    WHERE 
        c.isfriend IS DISTINCT FROM true -- Exclude friends
        AND (c.iswaitingconfirmation IS DISTINCT FROM true OR c.iswaitingconfirmation IS NULL) -- Exclude pending requests
        AND o.email != $1 -- Exclude the logged-in user
    ORDER BY 
        d.dogid ASC;
  `;

  console.log('Executing query with email:', loggedInUserEmail); // Debug log
  const result = await db.query(query, [loggedInUserEmail]);
  return result.rows;
};

//Get a Specific Dog Without Its Owner’s Data.
exports.getDogWithoutOwner = async (dogId) => {
  const query = `
    SELECT 
        dogid AS id,
        name,
        breed,
        EXTRACT(YEAR FROM CURRENT_DATE) - yearofbirth AS age,
        sex,
        region,
        isvaccinated,
        isgoodwithkids,
        isgoodwithanimals,
        isinrestrictedbreedscategory,
        description,
        energylevel
    FROM 
        public.dog
    WHERE 
        dogid = $1;
  `;

  const result = await db.query(query, [dogId]); // Execute query with dogId as parameter
  return result.rows[0]; // Return the first row (single dog)
};

// Function to fetch a specific owner's details without including their dogs
exports.getOwnerWithoutDog = async (ownerEmail) => {
  // SQL query to get only owner details based on their email
  const query = `
    SELECT 
        email,
        firstname,
        lastname,
        gender,
        EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM dateofbirth) AS age,
        city,
        url AS image
    FROM 
        public.owner
    WHERE 
        email = $1; -- Filter by owner email
  `;

  // Execute the query and return the first result row
  const result = await db.query(query, [ownerEmail]);
  return result.rows[0]; // Return a single owner
};


// Function to fetch details of a specific dog and its owner
exports.getDogAndOwner = async (dogId) => {
  // SQL query to fetch the dog's details and the owner's information
  const query = `
    SELECT 
        d.dogid AS id,
        d.name AS dog_name,
        d.breed,
        EXTRACT(YEAR FROM CURRENT_DATE) - d.yearofbirth AS dog_age,
        d.sex AS dog_sex,
        d.region AS dog_region,
        d.isvaccinated,
        d.isgoodwithkids,
        d.isgoodwithanimals,
        d.isinrestrictedbreedscategory,
        d.description AS dog_description,
        d.energylevel,
        d.image AS dog_image,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.email AS owner_email,
        o.gender AS owner_gender,
        EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS owner_age,
        o.city AS owner_city,
        o.image AS owner_image
    FROM 
        public.dog d
    JOIN 
        public.belongs_to bt ON d.dogid = bt.dogid
    JOIN 
        public.owner o ON bt.owneremail = o.email
    WHERE 
        d.dogid = $1; -- Filter by the dog's ID
  `;

  // Execute the query with the provided dog ID and return the first result row
  const result = await db.query(query, [dogId]);
  return result.rows[0];
};

// Function to fetch friends and their dogs:
exports.getFriendsDogsAndOwners = async (loggedInUserEmail) => {
  const query = `
    SELECT 
        d.dogid AS id,
        d.name,
        d.breed,
        EXTRACT(YEAR FROM CURRENT_DATE) - d.yearofbirth AS age,
        d.sex,
        d.region,
        d.isvaccinated,
        d.isgoodwithkids,
        d.isgoodwithanimals,
        d.isinrestrictedbreedscategory,
        d.description,
        d.energylevel,
        d.image,
        o.firstname,
        o.lastname,
        o.email,
        o.gender,
        EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS ownerage,
        o.city,
        o.image AS ownerimage
    FROM 
        public.dog d
    JOIN 
        public.belongs_to bt ON d.dogid = bt.dogid
    JOIN 
        public.owner o ON bt.owneremail = o.email
    JOIN 
        public.communication c 
        ON (c.owneremail1 = o.email AND c.owneremail2 = $1) 
        OR (c.owneremail2 = o.email AND c.owneremail1 = $1)
    WHERE 
        c.isfriend = true -- Include only friends
        AND o.email != $1 -- Exclude the logged-in user
    ORDER BY 
        d.dogid ASC;
  `;
  console.log('Executing query to fetch friends for:', loggedInUserEmail); // Debug log
  const result = await db.query(query, [loggedInUserEmail]);
  return result.rows;
};

// Function to fetch the logged-in owner's details
exports.getOwnerAndDog = async (loggedInUserEmail) => {
  const query = `
    SELECT 
        d.dogid AS id,
        d.name AS dog_name,
        d.breed,
        EXTRACT(YEAR FROM CURRENT_DATE) - d.yearofbirth AS dog_age,
        d.sex AS dog_sex,
        d.region AS dog_region,
        d.isvaccinated,
        d.isgoodwithkids,
        d.isgoodwithanimals,
        d.isinrestrictedbreedscategory,
        d.description AS dog_description,
        d.energylevel,
        d.image AS dog_image,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.email AS owner_email,
        o.gender AS owner_gender,
        EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS owner_age,
        o.city AS owner_city,
        o.image AS owner_image
    FROM 
        public.dog d
    JOIN 
        public.belongs_to bt ON d.dogid = bt.dogid
    JOIN 
        public.owner o ON bt.owneremail = o.email
    WHERE 
        o.email = $1; -- Filter by logged-in user's email
  `;
  const result = await db.query(query, [loggedInUserEmail]);
  return result.rows;
};

// Update Dog information
// Used in "Edit Dog Information" at "MyProfile"
exports.updateDog = async (dogId, updatedData) => {
  const query = `
    UPDATE public.dog
    SET 
      name = $1,
      breed = $2,
      region = $3,
      isvaccinated = $4,
      isgoodwithkids = $5,
      isgoodwithanimals = $6,
      isinrestrictedbreedscategory = $7,
      description = $8,
      energylevel = $9
    WHERE dogid = $10
    RETURNING dogid, name, breed, region, isvaccinated, isgoodwithkids, isgoodwithanimals, isinrestrictedbreedscategory, description, energylevel;
  `;
  const values = [
    updatedData.name,
    updatedData.breed,
    updatedData.region,
    updatedData.isvaccinated,
    updatedData.isgoodwithkids,
    updatedData.isgoodwithanimals,
    updatedData.isinrestrictedbreedscategory,
    updatedData.description,
    updatedData.energylevel,
    dogId,
  ];

  const result = await db.query(query, values); // Execute the update query
  return result.rows[0]; // Return the updated dog information
};

