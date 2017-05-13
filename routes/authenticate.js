const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/", (req, res) => {
    if(req.isAuthenticated()){
        res.render("groupin/static");
    } else {
        res.render("authenticate/login", {error: req.flash('error')});
    }
});

router.post("/login", passport.authenticate("local", { successRedirect: "/",
                                                       failureRedirect: "/",
                                                       failureFlash: true}));
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router;
