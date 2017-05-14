const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;
const xss = require("xss");

const passport = require('passport');


router.get("/", (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("/hub");
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
    username = xss(userArgs.username);
    password = xss(userArgs.password);
	if (username.length == 0) {
		req.flash("error", "Please provide a username");
		return res.redirect("/");
	}
	if (password.length == 0) {
		req.flash("error", "Please provide a password");
		return res.redirect("/");
	}
    userData.addUser(username, password).then((user) => {
        console.log(user);
        req.login(user, (err) => {
            if(err) next(err);
            return res.redirect("/");
        });
    }, (error) => {
        if(error === userData.USER_ERROR){
            req.flash("error", userData.USER_ERROR);
            res.redirect("/");
        }
        res.status(500).json(error);
    });
});

module.exports = router;
