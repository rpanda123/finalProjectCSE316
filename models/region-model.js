const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String
		},
		leader: {
			type: String
		},
		flag: {
			type: String
		},
		landmarks: {
			type: [String]
		},
		ancestorRegion: {
			type: String
		}
	},
	{ timestamps: true }
);

const Region = model('Region', regionSchema);

module.exports = Region;