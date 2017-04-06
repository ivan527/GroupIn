const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
	 getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },

	getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";

                return user;
            });
        });
    },

	addUser(login, password) {
        return users().then((userCollection) => {
            let newUser = {
                login: login,
                _id: uuid.v4(),
                profile: {
					username: "",
					mediaList: [],
					_id: uuid.v4()
				}
            };

            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });
    },

	removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },

	updatePassword(id, newPassword) {
        return this.getUserById(id).then((currentUser) => {
            let userUpdateInfo = {
                password: newPassword
            };

            let updateCommand = {
                $set: userUpdateInfo
            };

            return users().then((userCollection) => {
                return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });
        });
    },

	updateProfile(uid, username, mediaList) {
		return users().then((userCollection) => {
			return userCollection.findOne({_id: uid}).then((user) => {
				if (!user) return Promise.reject("User not found");

				let updatedProfileInfo = {
					username: username,
					mediaList: mediaList,
				};

				let updateCommand = {
					$set: updatedProfileInfo
				};

				return userCollection.updateOne({_id: uid}, updateCommand).then(() => {
					return this.getUserById(uid);
				});
			});
		});
	}
}

module.exports = exportedMethods;