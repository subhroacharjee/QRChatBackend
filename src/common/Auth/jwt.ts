/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import Logger from '../log';
import { ControllerReturnType } from '../../interfaces/Responses/Controller';


/**
 * @param  {any} data any object that is serializable.
 * @return {string}
 */
export const generateToken = (data:any) => {
	return jwt.sign(data, process.env.SECRET, {
		expiresIn: process.env.EXPIRES_IN,
	});
};

/**
 * @param  {string} token
 * @return {any[]} arr[0] -> error message, arr[1] -> data 
 */
export const validateToken = async (token:string, fieldsToexport?: string[]):Promise<ControllerReturnType<any>> => {
	try {
		let data:any = await jwt.verify(token, process.env.SECRET);
		if (fieldsToexport && fieldsToexport.length > 0) {
			const newData:any = {};
			for (const index in fieldsToexport) {
				const field = fieldsToexport[index];
				newData[field] = data[field];
			}
			data = newData;
		}
		return {
			error: null,
			data: data
		};
	} catch(error) {
		Logger.error(JSON.stringify(error));
		return {
			error: error.message,
			data: null
		};
	}
};