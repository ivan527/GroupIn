const LocalStrategy = require("passport-local").Strategy;
const data = require("../data");
const User = data.users;
const bcrypt = require('bcrypt');
const xss = require('xss');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        User.getUserByUsername(username).then((user) => {
            done(null, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            username = xss(username);
            password = xss(password);
            User.getUserByUsername(username).then((user) => {
                if(!user){
                    return done(null, false, { message: 'Incorrect username.'});
                }

                if (!(bcrypt.compareSync(password, user.password))){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            }, (err) => {
                return done(err);
            });
        }
    ));
};
