// chatsModel.js

const db = require('../db/db');

// get the logged in user chats users interact with
exports.getChatUsers = async (loggedInUserEmail) => {
  const query = `
    SELECT DISTINCT
      o.email AS ownerEmail,
      o.firstname AS firstName,
      o.lastname AS lastName,
      o.city,
      o.image,
      c.chatid
    FROM public.owner o
    JOIN public.chat c
      ON (c.owneremail1 = o.email AND c.owneremail2 = $1)
      OR (c.owneremail2 = o.email AND c.owneremail1 = $1)
    WHERE o.email != $1
  `;
  const result = await db.query(query, [loggedInUserEmail]);
  return result.rows;
};
