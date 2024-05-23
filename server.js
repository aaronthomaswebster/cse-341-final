const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

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
  .use(cors({ 
    methods: "GET,POST,PUT,DELETE,UPDATE,PATCH,OPTIONS" ,
    origin: ['http://localhost:3000', 'https://github.com', '*'],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, z-key'
  }))
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

app.get("/", (req, res) => {
  console.log(req.session.user)
  res.send(
    req.session.user !== undefined
      ? "logged in as " + req.session.user.username
      : "Logged out"
  );
});
app.get(
  "/github/callback",
  passport.authenticate("github", { 
    failureRedirect: '/api-docs', session: false}),
    (req, res) =>{
      req.session.user = req.user;res.redirect('/');
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
