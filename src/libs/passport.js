const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool_db = require("../database");
const helpers = require("../libs/helpers");

passport.use(
    "local.signin",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        // newUser.password = await helpers.encryptPassword(password);
        console.log(req.body);
        const rows = await pool_db.query("SELECT * FROM  users WHERE username = ?", [username]);
        if (rows.length > 0){
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.password);
            console.log(validPassword);
            if (validPassword){
                return done(null, user, req.flash('success', 'Welcome ' + user.username));
            }else{
                return done(null, false, req.flash('message', 'Incorrect Password'));
            }
        } else{
            return done(null, false, req.flash('message', 'The Username does not exist'));
        }
      }
    )
  );

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