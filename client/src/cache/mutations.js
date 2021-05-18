import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			accessToken
			_id
			error
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateProfile($email: String!, $password: String!, $name: String!, $_id:String!) {
		updateProfile(email: $email, password: $password, name: $name, _id: $_id) {
			email
			password
			name
		}
	}
`;


export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_MAP = gql`
	mutation addMap($name:String!, $owner: String! ) {
		addMap(name:$name, owner:$owner){
			name
			_id
			owner
	}
}
`;

export const ADD_REGION = gql`
	mutation addRegion(  $name: String, $capital: String, $leader: String, $flag: String, $landmarks: [String], $ancestorRegion: String) {
		addRegion(  name: $name, capital: $capital, leader: $leader, flag: $flag, landmarks: $landmarks, ancestorRegion: $ancestorRegion) {
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

export const EDIT_REGION = gql`
	mutation editRegion($_id: String!,  $name: String!, $capital: String, $leader: String, $flag: String, $landmarks: [String], $ancestorRegion: String) {
		editRegion(_id: $_id, name: $name, capital: $capital, leader: $leader, flag: $flag, landmarks: $landmarks, ancestorRegion: $ancestorRegion) {
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

export const DELETE_REGION = gql`
	mutation deleteRegion($_id: String!) {
		deleteRegion(_id: $_id)
	}
`;

export const DELETE_MAP = gql`
	mutation deleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const MOVE_REGION = gql`
	mutation moveRegion($_id: String, $newParent: String) {
		moveRegion(_id: $_id, newParent: $newParent) {
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

export const ADD_LANDMARK = gql`
	mutation addLandmark($_id: String) {
		addLandmark(_id: $_id)
	}
`;

export const DELETE_LANDMARK = gql`
	mutation deleteLandmark($_id: String, $landmarkName: String) {
		deleteLandmark(_id: $_id, landmarkName: $landmarkName)
	}
`;

export const EDIT_LANDMARK = gql`
	mutation editLandmark($_id: String, $oldLandmarkName: String, $newLandmarkName: String) {
		editLandmark(_id: $_id, oldLandmarkName: $oldLandmarkName, newLandmarkName: $newLandmarkName)
	}
`;

