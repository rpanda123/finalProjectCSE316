const { gql } = require('apollo-server');

const typeDefs = gql `
	type User {
		_id: String
		name: String
		email: String
		password: String
	}
	type logined {
		_id:String
		accessToken: String
		error:String
	
	}
	extend type Query {
		getCurrentUser(_id:String): User
		testQuery: String
	}
	extend type Mutation {
		login(email: String!, password: String!): logined
		register(email: String!, password: String!, name: String!): User
		updateProfile(email: String!, password: String!, name: String!, _id: String!): User
		logout: Boolean!
	}
`;

module.exports = { typeDefs: typeDefs }