const prisma = require("./prisma");

// async function getUserByUsername(username) {
//   return prisma.user.findUnique({
//     where: { username },
//   });
// }

async function postNewUser(username, hashedPassword) {
  try {
    const user = await prisma.user.create({
      data: { username: username, passwordHash: hashedPassword },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
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

async function postRootFolder(userId) {
  try {
    await prisma.folder.create({
      data: {
        title: "Root",
        owner: { connect: { id: userId } },
        // No parent => this is the root folder
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function getRootFolder(userId) {
  try {
    const root = await prisma.folder.findFirst({
      where: {
        ownerId: userId,
        parentId: null,
        // No parent => this is the root folder
      },
      include: {
        children: true,
        files: true,
      },
    });
    console.log(root);
    return root;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function postNewFolder(title, ownerId, parentId = null) {
  try {
    const data = {
      title,
      owner: { connect: { id: ownerId } },
    };

    if (parentId) {
      data.parent = { connect: { id: parentId } };
    }

    await prisma.folder.create({ data });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function getFolderById(id) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: id },
      include: { children: true, files: true },
    });
    console.log(folder);
    return folder;
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function postNewFile(title, link, uploaderId, parentId, size) {
  try {
    const data = {
      title,
      link,
      uploader: { connect: { id: uploaderId } },
      parent: { connect: { id: parentId } },
      size,
    };

    // if (parentId) {
    //   data.parent = { connect: { id: parentId } };
    // }

    await prisma.file.create({ data });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function postDeleteFile(id) {
  try {
    await prisma.file.delete({
      where: { id: Number(id) },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

module.exports = {
  postNewUser,
  getUser,
  getUserById,
  postRootFolder,
  postNewFolder,
  getRootFolder,
  getFolderById,
  postNewFile,
  postDeleteFile,
};
