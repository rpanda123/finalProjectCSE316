const { model, Schema, ObjectId } = require('mongoose');
const User = require('./user-model').schema;

const mapSchema = new Schema( 
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number
		},
		name: {
			type: String
		},
		owner: {
			type: String
		}
	},
	{ timestamps: true }
);

const Map = model('Map', mapSchema);
module.exports = Map;