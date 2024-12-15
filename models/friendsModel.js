const db = require("../db/db");

// Model to fetch all friends of a logged-in user
exports.getFriends = async (userEmail) => {
  const query = `
    SELECT 
      d.dogid AS id,
      d.name AS name,
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
      d.image AS dog_image,
      o.firstname,
      o.lastname,
      o.email,
      o.gender,
      o.city,
      o.image AS owner_image,
      EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS owner_age
    FROM public.communication c
    JOIN public.owner o ON 
      (o.email = c.owneremail2 AND c.owneremail1 = $1) OR 
      (o.email = c.owneremail1 AND c.owneremail2 = $1)
    JOIN public.belongs_to bt ON o.email = bt.owneremail
    JOIN public.dog d ON d.dogid = bt.dogid
    WHERE c.isfriend = true;
  `;

  const result = await db.query(query, [userEmail]);

  // Map the result to the requested JSON structure
  const formattedData = result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    breed: row.breed,
    age: parseFloat(row.age).toFixed(1), // Age rounded to 1 decimal
    sex: row.sex,
    region: row.region,
    isvaccinated: row.isvaccinated,
    isgoodwithkids: row.isgoodwithkids,
    isgoodwithanimals: row.isgoodwithanimals,
    isinrestrictedbreedscategory: row.isinrestrictedbreedscategory,
    description: row.description,
    energylevel: row.energylevel,
    image: row.dog_image || `/data/images/${row.id}.jpeg`, // Fallback image
    owner: {
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      gender: row.gender,
      age: row.owner_age,
      city: row.city,
      image: row.owner_image || `/data/owners/${row.email}.jpeg`, // Fallback owner image
    },
  }));

  return formattedData;
};


// Model to fetch pending friend requests for a user
exports.getFriendRequests = async (userEmail) => {
    const query = `
      SELECT 
        d.dogid AS id,
        d.name AS name,
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
        d.image AS dog_image,
        o.firstname,
        o.lastname,
        o.email,
        o.gender,
        o.city,
        o.image AS owner_image,
        EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM o.dateofbirth) AS owner_age
      FROM public.communication c
      JOIN public.owner o ON o.email = c.owneremail1 -- Requestor is owneremail1
      JOIN public.belongs_to bt ON o.email = bt.owneremail
      JOIN public.dog d ON d.dogid = bt.dogid
      WHERE c.owneremail2 = $1 -- Receiver is owneremail2
        AND c.isfriend = false
        AND c.iswaitingconfirmation = true;
    `;
  
    const result = await db.query(query, [userEmail]);
  
    // Map the result to the requested JSON structure
    const formattedData = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      breed: row.breed,
      age: parseFloat(row.age).toFixed(1), // Age rounded to 1 decimal
      sex: row.sex,
      region: row.region,
      isvaccinated: row.isvaccinated,
      isgoodwithkids: row.isgoodwithkids,
      isgoodwithanimals: row.isgoodwithanimals,
      isinrestrictedbreedscategory: row.isinrestrictedbreedscategory,
      description: row.description,
      energylevel: row.energylevel,
      image: row.dog_image || `/data/images/${row.id}.jpeg`, // Fallback image
      owner: {
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
        gender: row.gender,
        age: row.owner_age,
        city: row.city,
        image: row.owner_image || `/data/owners/${row.email}.jpeg`, // Fallback owner image
      },
    }));
  
    return formattedData;
  };
  

// Model to send a friend request
exports.sendFriendRequest = async (senderEmail, recipientEmail) => {
  const query = `
    INSERT INTO public.communication (owneremail1, owneremail2, isfriend, iswaitingconfirmation)
    VALUES ($1, $2, false, true)
    ON CONFLICT DO NOTHING;
  `;
  const result = await db.query(query, [senderEmail, recipientEmail]);
  return result.rowCount > 0; // Return true if inserted
};

// Model to accept a friend request
exports.acceptFriendRequest = async (senderEmail, recipientEmail) => {
  const query = `
    UPDATE public.communication
    SET isfriend = true
    WHERE owneremail1 = $1 AND owneremail2 = $2 AND iswaitingconfirmation = true;
  `;
  const result = await db.query(query, [senderEmail, recipientEmail]);
  return result.rowCount > 0; // Return true if updated
};

// Model to remove a friend or decline a request
exports.removeFriend = async (email1, email2) => {
  const query = `
    DELETE FROM public.communication
    WHERE (owneremail1 = $1 AND owneremail2 = $2) OR (owneremail1 = $2 AND owneremail2 = $1);
  `;
  const result = await db.query(query, [email1, email2]);
  return result.rowCount > 0; // Return true if deleted
};
