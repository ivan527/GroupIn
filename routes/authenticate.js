const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;

const passport = require('passport');


router.get("/", (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("/user");
    } else {
        res.render("authenticate/login-signup", {error: req.flash('error')});
    }
});

router.post("/login", passport.authenticate("local", { successRedirect: "/",
                                                       failureRedirect: "/",
                                                       failureFlash: true}));

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

router.post("/signup", (req, res, next) => {
    let userArgs = req.body;
    userData.addUser(userArgs.username, userArgs.password).then((user) => {
        req.login(user, (err) => {
            if(err) next(err);
            return res.redirect("/");
        });
    }, () => {
        res.sendStatus(500);
    });
});

module.exports = router;
