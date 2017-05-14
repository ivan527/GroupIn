const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const mediaListData = data.mediaList;
const uuid = require("node-uuid");
const xss = require("xss");

router.get("/:_id", (req, res) => {
	mediaListData.getMediaListById(req.params._id).then((mediaList) => {
		console.log(mediaList);
		let i;
		let progress;
		for (i = 0; i < mediaList.progress.length; i++) {
			if (mediaList.progress[i][0] == req.user._id) {
				progress = mediaList.progress[i][1];
				break;
			}
		}
		res.render('groupin/mediaList', {mediaList: mediaList, errors: req.flash("error"), progress: progress});
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
		console.log(e);
		return res.status(500).json({error: e});
	});
});

router.post("/:_id/addMember", (req, res) => {
	let formInfo = req.body;
	let errors = [];
	formInfo.newMember = xss(formInfo.newMember);
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
	formInfo.mediaTitle = xss(formInfo.mediaTitle);

	if(typeof formInfo.mediaType !== "string" ||
		formInfo.mediaType.length === 0){
		errors.push("No type provided");
	}
	formInfo.mediaType = xss(formInfo.mediaType);

	if(typeof formInfo.numEpisodes !== "string" ||
		formInfo.numEpisodes.length === 0){
		errors.push("No number of Episodes provided");
	}
	formInfo.numEpisodes = xss(formInfo.numEpisodes);
	
	if(typeof formInfo.refLink !== "string" ||
		formInfo.refLink.length === 0){
		errors.push("No reference link provided");
	}
	formInfo.refLink = xss(formInfo.refLink);

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
    mediaListArgs.group_name = xss(mediaListArgs.group_name);
	if (mediaListArgs.group_name.length == 0) {
		req.flash("error", "Please specify a group name");
		return req.redirect("/hub");
	}
    mediaListData.addMediaList(req.user.username, req.user._id, mediaListArgs.group_name).then((mediaList) => {
		res.redirect("/hub");
    }, (err) => {
    	console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
