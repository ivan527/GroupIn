const express = require("express");
const data = require("../data");
const userData = data.users;
const mediaListData = data.mediaList;

const router = express.Router();
router.get("/", (req, res) => {
    let profile = req.user.profile;
    mediaListData.getMediaListsByUser(req.user._id).then((mediaLists) => {
        res.render('groupin/hub', {username: profile.username, _id: req.user._id, mediaList: mediaLists, errors: req.flash("error")})
    }, (err) => {
        res.sendStatus(500);
    });
});

module.exports = router;