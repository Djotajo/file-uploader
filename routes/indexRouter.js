const { Router } = require("express");

const indexRouter = Router();

const db = require("../db/queries");

// const newMessageController = require("../controllers/newMessageController");
// const newUserController = require("../controllers/newUserController");

// async function getAllMembers(req, res) {
//   const members = await db.getAllMembers();
//   const member = members[0];
//   return member;
// }

indexRouter.get("/", async (req, res) => {
  // const messages = await db.getAllMessagesAndAuthors();
  // res.render("index", { user: req.user, messages: messages });
  const root = await db.getRootFolder(req.user.id);
  res.render("index", { user: req.user, folder: root });
});

indexRouter.get("/:folderId/", async (req, res) => {
  try {
    const { folderId } = req.params;
    // const { model } = req.params;
    const folder = await db.getFolderById(folderId);
    res.render("index", { user: req.user, folder: folder });
    // res.render("layout", {
    //   title: model,
    //   content: "item",
    //   item: item,
    //   baseUrl: req.originalUrl,
    //   back: `/categories/types/${typeName}`,
    // });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Internal Server Error");
  }
});

indexRouter.post("/:parentId/add-folder", async (req, res) => {
  try {
    const { title, parentId } = req.body;
    console.log(req.body);
    console.log(title);
    console.log(parentId);
    await db.postNewFolder(title, req.user.id, parentId);
    // const { model } = req.params;
    const folder = await db.getFolderById(parentId);
    res.render("index", { user: req.user, folder: folder });
    // res.render("layout", {
    //   title: model,
    //   content: "item",
    //   item: item,
    //   baseUrl: req.originalUrl,
    //   back: `/categories/types/${typeName}`,
    // });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Internal Server Error");
  }
});

indexRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// indexRouter.post("/membership", newUserController.newMemberValidate);

// indexRouter.get("/member", async (req, res) => {
//   res.render("member", { title: "Become a member", errors: [] });
// });

// indexRouter.post("/message", newMessageController.newMessageCreate);

// indexRouter.post("/message/:id", newMessageController.deleteMessageById);

module.exports = indexRouter;
