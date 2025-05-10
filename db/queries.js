const prisma = require("./prisma");

// async function getUserByUsername(username) {
//   return prisma.user.findUnique({
//     where: { username },
//   });
// }

async function postNewUser(username, hashedPassword) {
  try {
    await prisma.user.create({
      data: { username: username, passwordHash: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function getUser(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}
// async function getUser(username) {
//   const user = await sql`SELECT * FROM members WHERE username = ${username}`;
//   return user;
// }

// async function getUserById(id) {
//   const user = await sql`SELECT * FROM members WHERE id = ${id}`;
//   return user;
// }

// async function getAllMessages() {
//   const messages =
//     await sql`SELECT messages.title, messages.text, messages.id FROM messages`;
//   return messages;
// }

// async function postNewMessage(title, text, authorID) {
//   await sql`INSERT INTO messages(title, text, author) VALUES (${title}, ${text}, ${authorID})`;
//   return;
// }

// async function postDeleteMessage(id) {
//   await sql`DELETE FROM messages WHERE id = ${id}`;
//   return;
// }

module.exports = {
  postNewUser,
  getUser,
  getUserById,
};
