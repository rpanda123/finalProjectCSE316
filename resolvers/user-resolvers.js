const ObjectId = require('mongoose').Types.ObjectId;
const mongoose= require('mongoose')
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const tokens = require('../utils/tokens');

module.exports = {
	Query: {
		/** 
			  @param 	 {object} req - the request object containing a user id
			@returns {object} the user object on success and an empty object on failure 
		**/
		getCurrentUser: async (_, args, { req }) => {
			const _id = new ObjectId(args._id);
			if (!_id) { return ({}) }
			const found = await User.findOne(_id);
			console.log(found);
			if (found) return found;
		},
	},
	Mutation: {
		/** 
			@param 	 {object} args - login info
			@param 	 {object} res - response object containing the current access/refresh tokens  
			@returns {object} the user object or an object with an error message
		**/
		login: async (_, args, { res }) => {
			const { email, password } = args;
			var loginResponse = ''
			let valid
			const user = await User.findOne({email: email});
			if(user.password){
				valid = (password==user.password)?true:false;
			console.log(valid);
			}else{
			loginResponse = {
					accessToken: null,
					_id: null,
					error: "email is not exist"
				}
				return loginResponse
			};
			if (!valid) {
				loginResponse = {
					accessToken: null,
					_id: null,
					error: "password is not valid"
				}
				return loginResponse
			};
			console.log(user);
			// Set tokens if login info was valid
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			if(user._id!=null){
				loginResponse= {
				accessToken: accessToken,
				_id: user._id,
				error: false,
			}}else{
				loginResponse= {
					accessToken: null,
					_id: null,
					error: "Account is not exist"
				}
			}
			console.log(loginResponse);
			return loginResponse;
		},
		/** 
			@param 	 {object} args - registration info
			@param 	 {object} res - response object containing the current access/refresh tokens  
			@returns {object} the user object or an object with an error message
		**/
		register: async (_, args, { res }) => {
			const { email, password, name } = args;
			const alreadyRegistered = await User.findOne({ email: email });
			if (alreadyRegistered) {
				console.log('User with that email already registered.');
				return (new User({
					_id: '',
					name: '',
					email: 'already exists',
					password: ''
				}));
			}
			const _id = new ObjectId();
			const user = new User({
				_id: _id,
				name: name,
				email: email,
				password: password,
			})
			const saved = await user.save();
			// After registering the user, their tokens are generated here so they
			// are automatically logged in on account creation.
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
			res.cookie('access-token', accessToken, { httpOnly: true, sameSite: 'None', secure: true });
			if (saved) return user;
		},
		updateProfile: async (_, args, { res }) => {
			const { email, password, name, _id } = args;
			let user=null;
			let updated=null;
			const id = ObjectId(_id) ;
			const exist = await User.findOne( {_id: id} );
			if (exist) {
				  user = new User({
						_id: ObjectId(exist._id),
						name: name  ,
						email: email  ,
						password: password,
					})
					console.log("user", user );
					updated = await User.updateOne({ "_id": exist._id}, // Filter
					{$set: {"name": name, "email":email,"password":password}}, // Update
					{upsert: true} );
			}else{
				  user = {
					  error:"user is not exist"
				  }
			} 
			if (updated) return user;
		},
		/** 
			@param 	 {object} res - response object containing the current access/refresh tokens  
			@returns {boolean} true 
		**/
		logout: (_, __, { res }) => {
			res.clearCookie('refresh-token');
			res.clearCookie('access-token');
			return true;
		}
	}
}
