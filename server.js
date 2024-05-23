const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const userController = require("./controllers/user.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app
  .use(
    session({
      secret:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.session());
app
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, z-key"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  })
  .use(
    cors({
      methods: "GET,POST,PUT,DELETE,UPDATE,PATCH,OPTIONS",
      origin: ["http://localhost:3000", "https://github.com", "*"],
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, z-key",
    })
  )
  .use("/", require("./routes"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get("/", async (req, res) => {
  if (req.session.user !== undefined) {

    // get the user from the database,
    // if the user is not found, insert a new user
    let user = await userController.getUserByPassportId(req.session.user.id);
    console.log({user})
    console.log('user is null', user == null)
    console.log('user is empty', user == [])
    console.log('user is undefined', user == undefined)
    console.log('user: ', typeof(user))
    console.log(JSON.stringify(user, null, 4));
    if (user == null || user == [] || user.length == 0 || user == undefined) {
      console.log("User not found, creating new user")
      user = await userController.createUser(req.session.user);
      console.log("User created")
      console.log({user})
    }
  }

  res.send(
    req.session.user !== undefined
      ? "logged in as " + req.session.user.username
      : "Logged out"
  );
});
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);
process.on("uncaughtException", (err) => {
  console.log(process.stderr.fd, "Uncaught Exception: ", err);
});

mongodb.initDb((err) => {
  if (err) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
