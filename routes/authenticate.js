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

module.exports = router;
