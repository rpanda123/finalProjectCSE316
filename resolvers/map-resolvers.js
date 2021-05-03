const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const User = require('../models/user-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllMaps2: async () => {
			return await Map.find();
		},
		/** 
			  @param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, args, { req }) => {
			const { userId } = args;
			let owner = new ObjectId(userId);
			console.log("owner",owner);
			const maps = await Map.find({ owner: owner });
			console.log(maps);
			if (maps) return (maps);
		},
		/** 
			  @param 	 {object} args - a map id
			@returns {object} a map on success and an empty object on failure
		**/
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({ _id: objectId });
			if (map) return map;
			else return ({});
		}
	},
	Mutation: {
		/** 
			@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { name, owner } = args;
			const objectId = new ObjectId();
			// const { id, name, owner } = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				id: 1 ,
				owner: owner
			});
			const saved = await newMap.save();
			if (saved) return newMap;
			else return ('Could not add map');
		},
		/** 
			  @param 	 {object} args - a map objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({ _id: objectId });
			if (deleted) return true;
			else return false;
		},
		/** 
			  @param 	 {object} args - a map objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		renameMap: async (_, args) => {
			const { _id, name } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({ _id: objectId }, { name: name });
			if (updated) return await Map.findOne({_id: objectId});
			else return "";
		}
	}
}
