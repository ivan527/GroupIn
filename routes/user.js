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
    let mediaListArray =
    mediaListData.getMediaListsByUser(req.user._id).then((mediaLists) => {
        res.render('groupin/hub', {username: profile.username, mediaList: mediaLists._id})
    }, () => {
        res.sendStatus(500);
    });
});

router.post("/create", (req, res) => {
    let mediaListArgs = req.body;
    mediaListData.addMediaList(req.user.username, req.user._id).then((mediaList) => {
        res.json(mediaList);
    }, () => {
        res.sendStatus(500);
    });
});



module.exports = router;
