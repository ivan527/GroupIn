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

	addMediaList(creator, creatorId) {
		return mediaList().then((mediaListCollection) => {
			let newMediaList = {
				_id: uuid.v4(),
				creator: creator,
				members: [creatorId],
				media: []
			};

			return mediaListCollection.insertOne(newMediaList).then((newInsertInformation) => {
				return newInsertInformation.insertedId;
			}).then((newId) => {
				return this.getUserById(newId);
			});
		});
	},

	removeMediaList(id) {
		return mediaList().then((mediaListCollection) => {
			return mediaListCollection.removeOne({ _id: id }).then((deletionInfo) => {
				if (deletionInfo.deletedCount === 0) {
					return Promise.reject(`Could not delete media list with id of ${id}`)
				}
			});
		});
	},

	addMember(mediaListId, memberId) {
		return this.getMediaListById(mediaListId).then((currentMediaList) => {
			let newMemberListInfo = {
				members: currentMediaList.members.append(memberId)
			};

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
				media: currentMediaList.media.append(media)
			};

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
				if (currentMediaList.media[i].Title == mediaTitle) {
					break;
				}
			}

			let newMediaListInfo = {
				media: currentMediaList.media.splice(i, 1);
			};

			let updateCommand = {
				$set: newMediaListInfo
			};

			return mediaList().then((mediaListCollection) => {
				return mediaListCollection.updateOne({ _id: mediaListId }, updateCommand).then(() => {
					return this.getMediaListById(mediaListId)
				});
			});
		});
	}
}