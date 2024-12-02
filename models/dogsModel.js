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
      o.url AS ownerimage
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
        o.url AS owner_image
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

