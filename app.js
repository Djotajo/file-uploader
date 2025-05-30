const express = require("express");
const path = require("node:path");
const app = express();
require("dotenv").config();

const http = require("http");
const db = require("./db/queries");
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");
const sql = neon(process.env.DATABASE_URL);
const assetsPath = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

app.use(express.static(path.join(__dirname, "public")));

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({ storage: storage });

const indexRouter = require("./routes/indexRouter");
const signupRouter = require("./routes/signupRouter");

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// app.post("/profile", upload.single("file"), async function (req, res, next) {
//   console.log(req.file.filename);
//   console.log(req.file.destination);
//   await db.postNewFile(
//     req.file.filename,
//     req.file.destination,
//     "55abad91-39fa-488e-9f9a-40932a33b611",
//     "11111"
//   );
//   res.redirect("/");
// });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

// app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/signup", signupRouter);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
// Local Strategy - TOP

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

app.use("/", indexRouter);

// app.get("/welcome", (req, res) => res.render("welcome"));

// Local Strategy - TOP
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);

      if (!user) {
        console.log("no user");
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.passwordHash);

      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});
