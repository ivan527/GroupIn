const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const mediaListData = data.mediaList;

router.get("/:_id", (req, res) => {
	medialistData.getMediaListById(req.params.id).then((mediaList) => {
		res.render('groupin/mediaList', {creator: mediaList.creator, media: mediaList.media})
	});
});

router.post("/addMember", (req, res) => {

});

router.post("/addMedia", (req, res) => {

});

router.post("/:title", (req, res) => {

});

module.exports = router;