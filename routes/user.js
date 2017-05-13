const express = require("express");
const data = require("../data");
const userData = data.users;
const mediaListData = data.mediaList;

const router = express.Router();
router.get("/profile", (req, res) => {
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
