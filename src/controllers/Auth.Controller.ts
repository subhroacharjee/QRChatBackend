import Logger from '../common/log';
import UserModel from '../models/User.model';
import { hash, verifyHash } from '../common/Auth/hash';
import { User } from '../interfaces/Model/User';
import { LoginPayload, RegisterPayload } from '../interfaces/Requests/Auth';
import { createMongooseValidationError } from '../common/functions';
import { generateToken } from '../common/Auth/jwt';
import { UserResponse } from '../interfaces/Responses/Auth';
import { ControllerReturnType } from '../interfaces/Responses/Controller';
import { Default500Response } from '../common/Constants/DefaultErrStatus';

/**
 * @param  {LoginPayload} data
 */
export const login = async(data:LoginPayload): Promise<ControllerReturnType<UserResponse>> => {

	try {
		const user = await UserModel
			.findOne()
			.where('email').equals(data.email)
			.exec();
		if (!user) {
			return {
				error: {
					email: ['Invalid email/password'],
				},
				data: null
			};
		}

		const hashedPassword = user.password;
		if (!verifyHash(data.password, hashedPassword)) {
			return {
				error: {
					email: ['Invalid email/password'],
				},
				data: null
			};
		}

		const accessToken = generateToken({
			_id: user._id,
			username: user.username,
			email: user.email,
			created_at: user.created_at
		});

		const userResponse: UserResponse = {
			_id: user._id,
			username: user.username,
			email: user.email,
			created_at: user.created_at,
			access_token: accessToken
		};

		return {
			error: null,
			data: userResponse
		};


	} catch (error) {
		Logger.error(error.message);
		return Default500Response;
	}
};

/**
 * @param  {RegisterPayload} data Userdata
 * @return {ControllerReturnType<UserResponse>} error is null if data any error happens, or else data will be available.
 */
export const register = async(data:RegisterPayload): Promise<ControllerReturnType<UserResponse>> => {
	
	const userData:User = {
		username: data.username,
		email: data.email,
		password: hash(data.password)
	};
	try {
		const newUser = new UserModel(userData);
		await newUser.save();
		userData._id = newUser._id;
		userData.created_at = newUser.created_at;
		const accessToken = generateToken({
			_id: userData._id,
			username: userData.username,
			email: userData.email,
			created_at: userData.created_at
		});

		const userResponse: UserResponse = {
			_id: userData._id,
			username: userData.username,
			email: userData.email,
			created_at: userData.created_at,
			access_token: accessToken
		};

		return {
			error: null,
			data: userResponse
		};
	} catch (error) {
		Logger.error(JSON.stringify(error));
		const validationErrorObject = createMongooseValidationError(error);
		if (validationErrorObject!== null) return {
			error: validationErrorObject,
			data: null
		};
		return Default500Response;
	}
};

/**
 * @param  {any} data
 */
export const getUser = async(data:any) => {
	return;
};