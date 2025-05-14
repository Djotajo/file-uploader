const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const passErr =
  "must be at least 8 characters long and include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.";

const validateUser = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Username ${lengthErr}`),
  body("password")
    .isStrongPassword({
      minLength: 3,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(`Password ${passErr}`),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.newUserCreate = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("form", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    try {
      const { username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.postNewUser(username, hashedPassword);
      await db.postRootFolder(newUser.id);

      return res.redirect("/");
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).render("form", {
        title: "Create user",
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];
