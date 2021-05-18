const { gql } = require('apollo-server');


const typeDefs = gql`
	type Region {
		_id: String
		name: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
		ancestorRegion: String
	}

	extend type Query {
		getAllSubRegions (ancestorRegion: String): [Region]
		getAllRegions (mapId: String): [Region]
		getAllRegions2: [Region]
		getRegionById(_id: String!): Region
		getPreviousRegion(curId: String): Region
		getNextRegion(curId: String): Region
	}

	extend type Mutation {
		addRegion(_id: String,
			name: String,
			capital: String,
			leader: String,
			flag: String,
			landmarks: [String],
			ancestorRegion: String): Region
		editRegion(_id: String!, 
			name: String!,
			capital:String,
			leader:String,
			flag:String,
			landmarks:[String],
			ancestorRegion:String): Region
		deleteRegion(_id: String!): Boolean
		moveRegion(_id: String!, newAncestor: String!): Region
		addLandmark(_id: String!, landmarkName: String): [String]
		deleteLandmark(_id: String!, landmarkName: String): [String]
		editLandmark(_id: String!, oldLandmarkName: String, newLandmarkName: String): [String]
	}

	input RegionInput {
		_id: String
		name: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
		ancestorRegion: String
	}
`;

module.exports = { typeDefs: typeDefs }