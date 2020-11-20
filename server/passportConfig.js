const bcrypt = require("bcrypt");
const { getUserByEmail, getUserById } = require("./database");
const localStrategy = require("passport-local").Strategy;

const applyStrategy = (passport, db) => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        const user = getUserByEmail(db, email);

        if (!user) {
          return done(null, false);
        }

        const correctCredentials = bcrypt.compareSync(password, user.password);

        if (!correctCredentials) {
          return done(null, false);
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = getUserById(db, id);

    if (!user) {
      return done(new Error("User not found", false));
    }

    return done(null, { id: user.id, email: user.email });
  });
};

module.exports = applyStrategy;
