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
	let formInfo = req.body;
	let errors = []
	if (!formInfo.mediaTitle){
		errors.push("No title provided");
	}

	if(!formInfo.mediaType){
		errors.push("No type provided");
	}

	if(!formInfo.numEpisodes){
		errors.push("No number of Episodes provided");
	}
	
	if(!formInfo.refLink){
		errors.push("No reference link provided");
	}

	
});

router.post("/:title", (req, res) => {

});

module.exports = router;