const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int
		name: String!
		owner: String
	}

	extend type Query {
		getAllMaps(userId:String): [Map]
		getAllMaps2: [Map]
		getMapById(_id: String!): Map
	}
	extend type Mutation {
		addMap(name:String!, owner:String!): Map
		renameMap(_id: String!, name: String!): Map
		deleteMap(_id: String!): Boolean
	}
	input MapInput {
		id: Int
		name: String
		owner: String
	}
`;

module.exports = { typeDefs: typeDefs }
