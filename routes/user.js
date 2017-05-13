const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const mediaListData = data.mediaList;

router.post("/add", (req, res) => {
    let userArgs = req.body;
    userData.addUser(userArgs.username, userArgs.password).then((user) => {
        res.json(user);
    }, () => {
        res.sendStatus(500);
    });
});

router.get("/hub", (req, res) => {
    let profile = req.user.profile;
    res.render('groupin/hub', {username: profile.username, mediaList: profile.mediaList});
});

router.post("/create", (req, res) => {
    let mediaListArgs = req.body;
    
});



module.exports = router;
