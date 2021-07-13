const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool_db = require("../database");
const helpers = require("../libs/helpers");

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const newUser = {
        username: username,
        password: password,
        fullname: fullname,
      };
      newUser.password = await helpers.encryptPassword(password);
      const result = await pool_db.query("INSERT INTO users SET ?", [newUser]);
      newUser.id = result.insertId;
      return done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool_db.query("SELECT * FROM users WHERE id = ?", id);
    done(null, rows[0]);
});