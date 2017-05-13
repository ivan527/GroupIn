const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.post("/add", (req, res) => {
    let userArgs = req.body;
    userData.addUser(userArgs.username, userArgs.password).then((user) => {
        res.json(user);
    }, () => {
        res.sendStatus(500);
    });
});

router.get("/profile", (req, res) => {
    let profile = req.user.profile;
    res.render('hub', {username: profile.username, mediaList: profile.mediaList});
})

module.exports = router;
