const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllSubRegions: async (_, args) => {
			// console.log(args);
			const regions = await Region.find({ ancestorRegion: args.ancestorRegion });
			// console.log(regions);
			if (regions.length > 0) return (regions);
			else return await Region.find({ _id: args.ancestorRegion });
		},
		/** 
		 *  Find all regions having ancestor is mapId
			  @param 	 {object} args - the object contain mapId
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllRegions: async (_, args) => {
			const { mapId } = args;
			// console.log("mapId", mapId);
			const _id = new ObjectId(mapId);
			// console.log(mapId);
			// console.log(_id);
			if (!_id) { return ([]) };
			const regions = await Region.find({ ancestorRegion: _id });
			if (regions) return (regions);
		},

		getAllRegions2: async () => {
			return await Region.find();
		},
		/** 
			  @param 	 {object} args - a region id
			@returns {object} a region on success and an empty object on failure
		**/
		getRegionById: async (_, args) => {
			const { _id } = args;
			console.log(_id)
			const objectId = new ObjectId(_id);
			const region = await Region.findOne({ _id: objectId });
			console.log(region)
			if (region) return region;
			else return ({});
		},
		/** 
			  @param 	 {object} args - a region id
			@returns {object} a region on success and an empty object on failure
		**/
		getPreviousRegion: async (_, args) => {
			const { curId } = args;
			const objectId = new ObjectId(curId);
			const previousRegion = await Region.findOne({ _id: { $lt: curId } }).sort({ _id: -1 }).limit(1);
			if (previousRegion) return previousRegion;
			else return ({});
		},
		/** 
			  @param 	 {object} args - a region id
			@returns {object} a region on success and an empty object on failure
		**/
		getNextRegion: async (_, args) => {
			const { curId } = args;
			const objectId = new ObjectId(curId);
			const nextRegion = await Region.findOne({ _id: { $gt: curId } }).sort({ _id: 1 }).limit(1);
			if (nextRegion) return nextRegion;
			else return ({});
		}
	},
	Mutation: {
		/** 
			  @param 	 {object} args - an empty region object
			@returns {string} the objectID of the region or an error message
		**/
		addRegion: async (_, args) => {
			const { id, name, capital, leader, flag, landmarks, ancestorRegion } = args;
			const objectId = new ObjectId();
			const newRegion = new Region({
				_id: objectId,
				id: id || null,
				name: name,
				capital: capital,
				leader: leader,
				flag: flag,
				landmarks: landmarks,
				ancestorRegion: ancestorRegion
			});
			const updated = await newRegion.save();
			if (updated) return newRegion;
			else return ('Could not add region');

		},
		/** 
			  @param 	 {object} args - a region objectID, field and update value
			@returns {boolean} true on successful update, false on failure
		**/
		editRegion: async (_, args) => {
			const { _id, name, capital, leader, flag, landmarks, ancestorRegion } = args;
			const objectId = new ObjectId(_id);
			const ancestorId = new ObjectId(ancestorRegion);
			console.log(ancestorId);
			const ancestorRelated = await Region.findOne({ _id: ancestorId });
			console.log(ancestorRelated);
			if (true) {
				const exist = await Region.findOne({ _id: objectId });
				// console.log(exist);
				let updated = '';
				let res = '';
				if (exist) {
					// console.log('zooooo');
					const newRegion = new Region({
						name: name,
						capital: capital || '',
						leader: leader || '',
						flag: flag || '',
						landmarks: landmarks || [null],
						ancestorRegion: (ancestorRelated!=null) ? ancestorRelated._id :ancestorRegion
					});
					// console.log(newRegion);
					updated = await Region.updateOne({ "_id": exist._id }, // Filter
						{ $set: newRegion }, // Update
						{ upsert: true });
					console.log(updated);
					if (updated) {
						return res = {
							_id: exist._id,
							name: name,
							capital: capital || '',
							leader: leader || '',
							flag: flag || '',
							landmarks: landmarks || '',
							ancestorRegion: ancestorRegion
						}
					} else {
						return res = {
							error: "failure to update"
						}
					}
				} else {
					return res = {
						error: "region is not exist"
					}
				}
			} else {
				console.log('else');
				return res = {
					name: "Parent region is not exist",
				}
			}
		},
		/** 
			  @param 	 {object} args - a region objectID
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteRegion: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Region.deleteOne({ _id: objectId });
			if (deleted) return true;
			else return false;
		},
		/** 
			  @param 	 {object} args - a region objectID and new parent
			@returns {boolean} true on successful update, false on failure
		**/
		moveRegion: async (_, args) => {
			const { _id, newParent } = args;
			const objectId = new ObjectId(_id);
			let region = await Region.findOne({ _id: objectId });
			if (region) {
				const updated = await Region.updateOne(
					{ _id: objectId }, { ancestorRegion: newParent });
				if (updated) return await Region.findOne({ _id: objectId });
			}
			return "";
		},
		/** 
			  @param 	 {object} args - a region objectID and new landmark
			@returns {boolean} true on successful update, false on failure
		**/
		addLandmark: async (_, args) => {
			const { _id, landmarkName } = args;
			const objectId = new ObjectId(_id);
			let region = await Region.findOne({ _id: objectId });
			if (region) {
				let landmarksList = [];
				if (region.landmarks) {
					landmarksList = region.landmarks;
				}
				landmarksList.push(landmarkName);
				const updated = await Region.updateOne(
					{ _id: objectId }, { landmarks: landmarksList });
				if (updated) return landmarksList;
			}
			return "";
		},
		/** 
			  @param 	 {object} args - a region objectID and landmark
			@returns {boolean} true on successful update, false on failure
		**/
		deleteLandmark: async (_, args) => {
			const { _id, landmarkName } = args;
			const objectId = new ObjectId(_id);
			let region = await Region.findOne({ _id: objectId });
			if (region) {
				for (let i = 0; i < region.landmarks.length; i++) {
					if (region.landmarks[i] == landmarkName) {
						region.landmarks.splice(i, 1);
						break;
					}
				}
				let landmarksList = region.landmarks;
				// console.log(landmarksList);
				const updated = await Region.updateOne({ _id: objectId }, { landmarks: landmarksList });
				if (updated) return landmarksList;
			}
			return "";
		},
		/** 
			  @param 	 {object} args - a region objectID and new landmark
			@returns {boolean} true on successful update, false on failure
		**/
		editLandmark: async (_, args) => {
			const { _id, oldLandmarkName, newLandmarkName } = args;
			const objectId = new ObjectId(_id);
			let region = await Region.findOne({ _id: objectId });
			if (region) {
				for (let i = 0; i < region.landmarks.length; i++) {
					if (region.landmarks[i] == oldLandmarkName) {
						region.landmarks[i] = newLandmarkName;
						break;
					}
				}
				let landmarksList = region.landmarks;
				const updated = await Region.updateOne({ _id: objectId }, { landmarks: landmarksList });
				if (updated) return landmarksList;
			}
			return "";
		}
	}
}
