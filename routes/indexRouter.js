const { Router } = require("express");

const indexRouter = Router();

// const db = require("../db/queries");

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
  res.render("index", { user: req.user });
});

// indexRouter.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// indexRouter.post("/membership", newUserController.newMemberValidate);

// indexRouter.get("/member", async (req, res) => {
//   res.render("member", { title: "Become a member", errors: [] });
// });

// indexRouter.post("/message", newMessageController.newMessageCreate);

// indexRouter.post("/message/:id", newMessageController.deleteMessageById);

module.exports = indexRouter;
