const db = require('../db/db');

exports.getAllDogs = async () => {
  const result = await db.query('SELECT * FROM public.dog');
  return result.rows;
};

exports.getDogById = async (id) => {
  const result = await db.query('SELECT * FROM public.dog WHERE id = $1', [id]);
  return result.rows[0];
};
