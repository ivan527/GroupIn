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

router.post("/:_id/addMember", (req, res) => {

});

router.post("/:_id/addMedia", (req, res) => {
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

	if(errors.length > 0){
		res.render("groupin/mediaList", {errors: errors, hasErrors:true, post: formInfo});
		return;
	}

	let media = {
		title: formInfo.mediaTitle,
		type: formInfo.mediaType,
		episodes: formInfo.numEpisodes,
		reference: formInfo.refLink,
		status: "unwatched",
		voteToSkip: 0
	}

	mediaListData.addMedia(req.params._id, media)
	.then((newMedia) => {
		res.redirect('/${newMedia._id}');
	}).catch((e) => {
		res.status(500).json({error: e});
	});
});

router.post("/:title", (req, res) => {

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
