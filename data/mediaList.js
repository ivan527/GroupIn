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
					return Promise.reject('Could not delete ')
				}
			})
		})
	}
}