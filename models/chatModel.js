const db = require('../db/db');

// Check if a chat already exists between two users
exports.checkChatExists = async (ownerEmail1, ownerEmail2) => {
  const query = `
    SELECT * FROM public.chat
    WHERE (owneremail1 = $1 AND owneremail2 = $2)
       OR (owneremail1 = $2 AND owneremail2 = $1);
  `;
  const result = await db.query(query, [ownerEmail1, ownerEmail2]);
  return result.rows[0]; // Return existing chat if found
};

// Create a new chat if it doesn't exist
exports.createChat = async (ownerEmail1, ownerEmail2) => {
  const normalizedPair = `${ownerEmail1}-${ownerEmail2}`;
  const query = `
    INSERT INTO public.chat (startdate, starttime, owneremail1, owneremail2, normalizedpair)
    VALUES (CURRENT_DATE, CURRENT_TIME, $1, $2, $3)
    RETURNING *;
  `;
  const values = [ownerEmail1, ownerEmail2, normalizedPair];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Fetch chat history (messages) between two users
exports.getChatHistory = async (ownerEmail1, ownerEmail2) => {
  const query = `
    SELECT senderemail, receiveremail, messagetext, messagedate, messagetime
    FROM public.message
    WHERE (senderemail = $1 AND receiveremail = $2)
       OR (senderemail = $2 AND receiveremail = $1)
    ORDER BY messagedate ASC, messagetime ASC;
  `;
  const result = await db.query(query, [ownerEmail1, ownerEmail2]);
  return result.rows;
};

// Save a new message to the database
exports.saveMessage = async (senderEmail, receiverEmail, messageText) => {
  // Generate the normalized pair (consistent with checkChatExists)
  const normalizedPair = [senderEmail, receiverEmail].sort().join("-");
  console.log("Generated normalizedPair:", normalizedPair); // Debug

  let chatId = null;

  try {
    // Step 1: Check if the chat exists and retrieve the chatid
    const chatQuery = `
      SELECT chatid FROM public.chat
      WHERE normalizedpair = $1;
    `;
    const chatResult = await db.query(chatQuery, [normalizedPair]);
    console.log("Chat query result:", chatResult.rows); // Debugging step

    if (chatResult.rows.length > 0) {
      chatId = chatResult.rows[0].chatid;
    } else {
      console.error("No existing chat found for normalizedPair:", normalizedPair);
      throw new Error("Chat does not exist. Cannot save message.");
    }

    // Step 2: Insert the new message with the retrieved chatid
    const insertQuery = `
      INSERT INTO public.message (chatid, senderemail, receiveremail, messagetext, messagedate, messagetime)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME)
      RETURNING *;
    `;
    const values = [chatId, senderEmail, receiverEmail, messageText];
    console.log("Inserting message with values:", values); // Debug log

    const result = await db.query(insertQuery, values);
    console.log("Message saved successfully:", result.rows[0]); // Confirm insert
    return result.rows[0];
  } catch (error) {
    console.error("Error in saveMessage function:", error.message);
    throw error;
  }
};




