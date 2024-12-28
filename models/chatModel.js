const db = require('../db/db'); // Database connection

// Create a chat or return an existing one
exports.createOrGetChat = async (ownerEmail1, ownerEmail2) => {
  try {
    // Normalize email pair
    const normalizedPair = [ownerEmail1, ownerEmail2].sort().join('-');

    // Check if the chat exists
    const queryCheck = `
      SELECT * FROM public.chat
      WHERE normalizedpair = $1;
    `;
    const existingChat = await db.query(queryCheck, [normalizedPair]);

    if (existingChat.rows.length > 0) {
      return existingChat.rows[0]; // Return existing chat
    }

    // If chat doesn't exist, create it
    const queryInsert = `
      INSERT INTO public.chat (startdate, starttime, owneremail1, owneremail2, normalizedpair)
      VALUES (CURRENT_DATE, CURRENT_TIME, $1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(queryInsert, [
      ownerEmail1,
      ownerEmail2,
      normalizedPair,
    ]);
    return result.rows[0]; // Return the new chat
  } catch (error) {
    console.error('Error in createOrGetChat:', error.message);
    throw error;
  }
};

// Send a message
exports.sendMessage = async (
  chatId,
  senderEmail,
  receiverEmail,
  messageText
) => {
  try {
    const query = `
      INSERT INTO public.message (chatid, senderemail, receiveremail, messagetext, messagedate, messagetime)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME)
      RETURNING *;
    `;
    const result = await db.query(query, [
      chatId,
      senderEmail,
      receiverEmail,
      messageText,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    throw error;
  }
};

// Get all messages in a chat
exports.getMessagesByChatId = async (chatId) => {
  try {
    const query = `
      SELECT * FROM public.message
      WHERE chatid = $1
      ORDER BY messagedate ASC, messagetime ASC;
    `;
    const result = await db.query(query, [chatId]);
    return result.rows;
  } catch (error) {
    console.error('Error in getMessagesByChatId:', error.message);
    throw error;
  }
};

// Get chat users
exports.getChatUsers = async (email) => {
  try {
    const query = `
      SELECT DISTINCT c.chatid, o.firstname, o.lastname, o.city, o.image
      FROM public.chat c
      JOIN public.owner o
        ON (c.owneremail1 = o.email OR c.owneremail2 = o.email)
      WHERE (c.owneremail1 = $1 OR c.owneremail2 = $1) AND o.email != $1;
    `;
    const result = await db.query(query, [email]);
    return result.rows;
  } catch (error) {
    console.error('Error in getChatUsers:', error.message);
    throw error;
  }
};
