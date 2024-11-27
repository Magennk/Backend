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
  const result = await db.query('SELECT * FROM public.dog WHERE id = $1', [id]);
  return result.rows[0];
};
