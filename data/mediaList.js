const mongoCollections = require("../config/mongoCollections");
const mediaList = mongoCollections.mediaList;
const uuid = require('node-uuid');

let exportedMethods = {
	getAllMediaLists() {
		return mediaList().then((mediaListCollection) => {
			return mediaListCollection.find({}).toArray();
		});
	},

	getMediaListById(id) {
		return mediaList().then((mediaListCollection) => {
			return mediaListCollection.findOne({ _id: id }).then((mediaList) => {
				if (!mediaList) return Promise.reject("Media List not found");

				return mediaList;
			});
		});
	},

	getMediaListsByUser(user_id) {
		return mediaList().then((mediaListCollection) => {
			return mediaListCollection.find({members: user_id}).toArray()
		});
	},

	addMediaList(creator, creatorId, name) {
		return mediaList().then((mediaListCollection) => {
			let newMediaList = {
				_id: uuid.v4(),
				name: name,
				creator: creator,
				members: [creatorId],
				media: [],
				progress: []
			};

			return mediaListCollection.insertOne(newMediaList).then((newInsertInformation) => {
				return newInsertInformation.insertedId;
			}).then((newId) => {
				return this.getMediaListById(newId);
			});
		});
	},

	removeMediaList(id) {
		return mediaList().then((mediaListCollection) => {
			return mediaListCollection.removeOne({ _id: id }).then((deletionInfo) => {
				if (deletionInfo.deletedCount === 0) {
					  return Promise.reject(`Could not delete media list with id of ${id}`);
				}
			});
		});
	},

	addMember(mediaListId, memberId) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let newMemberListInfo = {
				members: currentMediaList.members.slice(),
				progress: currentMediaList.progress.slice()
			};
			newMemberListInfo.members.push(memberId);
			newMemberListInfo.progress.push((memberId, 0));

			let updateCommand = {
				$set: newMemberListInfo
			};

			return mediaList().then((mediaListCollection) => {
				return mediaListCollection.updateOne({ _id: mediaListId }, updateCommand).then(() => {
					return this.getMediaListById(mediaListId);
				});
			});
		});
	},

	addMedia(mediaListId, media) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let newMemberListInfo = {
				media: currentMediaList.media.slice()
			};
			newMemberListInfo.media.push(media);

			let updateCommand = {
				$set: newMemberListInfo
			};

			return mediaList().then((mediaListCollection) => {
				return mediaListCollection.updateOne({ _id: mediaListId }, updateCommand).then(() => {
					return this.getMediaListById(mediaListId);
				});
			});
		});
	},

	removeMediaByTitle(mediaListId, mediaTitle) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let i;
			for (i = 0; i < currentMediaList.media.length; i++) {
				if (currentMediaList.media[i].title == mediaTitle) {
					break;
				}
			}

			let newMediaListInfo = {
				media: currentMediaList.media.splice(i, 1)
			};

			let updateCommand = {
				$set: newMediaListInfo
			};

			return mediaList().then((mediaListCollection) => {
				return mediaListCollection.updateOne({ _id: mediaListId }, updateCommand).then(() => {
					  return this.getMediaListById(mediaListId);
				});
			});
		});
	},

	voteToSkipById(mediaListId, mediaId) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let i;
			let vote;
			for (i = 0; i < currentMediaList.media.length; i++) {
				if (currentMediaList.media[i]._id == mediaId) {
					vote = currentMediaList.media[i].voteToSkip + 1
					break;
				}
			}
			let updateCommand = {};
			if (vote > currentMediaList.members.length/2) {
				updateCommand["media.$.status"] = "Skip"
			}
			updateCommand["media.$.voteToSkip"] = vote

			return mediaListCollection.update({_id: mediaListId, media: {$elemMatch: {_id: mediaId}}}, {$set: updateCommand}).then(() => {
				return this.getMediaListById(mediaListId);
			});
		});
	},

	setMediaToWatched(mediaListId, mediaId) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let updateCommand = {};
			updateCommand["media.$.status"] = "watched"

			return mediaListCollection.update({_id: mediaListId, media: {$elemMatch: {_id: mediaId}}}, {$set: updateCommand}).then(() => {
				return this.getMediaListById(mediaListId);
			});
		});
	},

	incrementProgress(mediaListId, memberId) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let i;
			let progress;
			for (i = 0; i < currentMediaList.progress.length; i++) {
				if (currentMediaList.progress[i][0] == memberId) {
					progress = currentMediaList.progress[i][1] + 1
					break;
				}
			}

			let newMemberListInfo = {
				progress: currentMediaList.progress.slice()
			};

			newMemberListInfo.progress[i][1] = progress;

			let updateCommand = {
				$set: newMemberListInfo
			};

			return mediaList().then((mediaListCollection) => {
				return mediaListCollection.updateOne({ _id: mediaListId }, updateCommand).then(() => {
					return this.getMediaListById(mediaListId);
				});
			});
		})
	}
};

module.exports = exportedMethods;