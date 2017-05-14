const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const mediaListData = data.mediaList;
const uuid = require("node-uuid");

router.get("/:_id", (req, res) => {
	mediaListData.getMediaListById(req.params._id).then((mediaList) => {
		console.log(mediaList);
		res.render('groupin/mediaList', {mediaList: mediaList, errors: req.flash("error")});
	});
});

router.get("/media/:_mediaId/skip", (req, res) => {
	mediaListData.voteToSkipById(req.params._mediaId).then((mediaList) => {
		return res.redirect(`/medialist/${mediaList._id}`);
	}).catch((e) => {
		console.log(e);
		return res.status(500).json({error: e});
	});
});

router.get("/media/:_mediaId/watched", (req, res) => {
	mediaListData.setMediaToWatched(req.params._mediaId).then((mediaList) => {
		return res.redirect(`/medialist/${mediaList._id}`);
	}).catch((e) => {
		return res.status(500).json({error: e});
	});
});

router.get("/:_mediaListId/progress", (req, res) => {
	mediaListData.incrementProgress(req.params._mediaListId, req.user._id).then((mediaList) => {
		return res.redirect(`/medialist/${req.params._mediaListId}`);
	}).catch((e) => {
		return res.status(500).json({error: e});
	});
});



router.post("/:_id/addMember", (req, res) => {
	let formInfo = req.body;
	let errors = [];
	console.log("add members");
	if (typeof formInfo.newMember !== "string" ||
		formInfo.newMember.length === 0){
			errors.push("No id provided");
	}
	
	if(errors.length > 0){
		errors.forEach((error) => {
			req.flash("error", error);
		});
		return res.redirect(`/medialist/${req.params._id}`);
	}

	mediaListData.addMember(req.params._id, formInfo.newMember).then((newMember) => {
		return res.redirect(`/medialist/${req.params._id}`);
	}).catch((e) => {
		return res.status(500).json({error: e});
	});

});

router.post("/:_id/addMedia", (req, res) => {
	let formInfo = req.body;
	let errors = []
	if (typeof formInfo.mediaTitle !== "string" ||
		formInfo.mediaTitle.length === 0){
		errors.push("No title provided");
	}

	if(typeof formInfo.mediaType !== "string" ||
		formInfo.mediaType.length === 0){
		errors.push("No type provided");
	}

	if(typeof formInfo.numEpisodes !== "string" ||
		formInfo.numEpisodes.length === 0){
		errors.push("No number of Episodes provided");
	}
	
	if(typeof formInfo.refLink !== "string" ||
		formInfo.refLink.length === 0){
		errors.push("No reference link provided");
	}

	if(errors.length > 0){
		errors.forEach((error) => {
			req.flash("error", error);
		});
		console.log("redirectings");
		return res.redirect(`/medialist/${req.params._id}`);
	}

	let media = {
		_id: uuid.v4(),
		title: formInfo.mediaTitle,
		type: formInfo.mediaType,
		episodes: parseInt(formInfo.numEpisodes),
		reference: formInfo.refLink,
		status: "unwatched",
		voteToSkip: 0
	}

	mediaListData.addMedia(req.params._id, media)
	.then((newMedia) => {
		return res.redirect(`/medialist/${req.params._id}`);
	}).catch((e) => {
		console.log(e);
		return res.status(500).json({error: e});
	});
});

router.post("/create", (req, res) => {
	console.log("create");
    let mediaListArgs = req.body;
    mediaListData.addMediaList(req.user.username, req.user._id, mediaListArgs.group_name).then((mediaList) => {
		res.redirect("/hub");
    }, (err) => {
    	console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
