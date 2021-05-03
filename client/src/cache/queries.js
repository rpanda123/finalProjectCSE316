import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser($_id: String!) {
		getCurrentUser(_id: $_id) {
			_id
			name
			email
			password
		}
	}
`;

export const GET_MAP = gql`
	query GetDBMap($_id: String!){
		getAllMaps(userId: $_id) {
			_id 
			id
		name 
		owner 
		}
	}
`;

export const GET_ALL_MAPS = gql`
	query getAllMaps ($userId: String) {
		getAllMaps (userId: $userId) {
			_id
			id
			name
			owner
		}
	}
`;

export const GET_MAP_BY_ID = gql`
	query getMapById ($_id: String!) {
		getMapById (_id: $_id) {
			id
			name
			owner
		}
	}
`;

export const GET_ALL_REGIONS_OF_ANCESTOR = gql`
	query getAllSubRegions ($ancestorRegion: String) {
		getAllSubRegions (ancestorRegion: $ancestorRegion) {
			_id
			name
			capital
			leader
			flag
			landmarks
			ancestorRegion
		}
	}
`;
export const GET_ALL_REGIONS = gql`
	query getAllRegions ($mapId: String) {
		getAllRegions (mapId: $mapId) {
			_id
			name
			capital
			leader
			flag
			landmarks
			ancestorRegion
		}
	}
`;
export const GET_REGION_BY_ID = gql`
	query getRegionById ($_id: String!) {
		getRegionById(_id: $_id) {
			_id
			name
			capital
			leader
			flag
			landmarks
			ancestorRegion
		}
	}
`;

export const GET_PREVIOUS_REGION = gql`
	query getPreviousRegion ($id: String) {
		getPreviousRegion(_id: $id) {
			_id
			id
			name
			capital
			leader
			flag
			landmarks
			ancestorRegion
		}
	}
`;

export const GET_MEXT_REGION = gql`
	query getNextRegion ($id: String) {
		getNextRegion(_id: $id) {
			_id
			id
			name
			capital
			leader
			flag
			landmarks
			ancestorRegion
		}
	}
`;



