const LocalStrategy = require("passport-local").Strategy;
const data = require("../data");
const User = data.users;
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        User.findOne(username).then((user) => {
            done(null, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            User.getUserByUsername(username).then((user) => {
                if(!user){
                    return done(null, false, { message: 'Incorrect username.'});
                }

                if (!(bcrypt.compareSync(password, user.hashedPassword))){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            }, (err) => {
                return done(err);
            });
        }
    ));
};
