const { Router } = require("express");

const signupRouter = Router();

const db = require("../db/queries");
const newUserController = require("../controllers/newUserController");

signupRouter.get("/", (req, res) => {
  console.log("here");
  res.render("form");
});

signupRouter.post("/", newUserController.newUserCreate);

module.exports = signupRouter;
