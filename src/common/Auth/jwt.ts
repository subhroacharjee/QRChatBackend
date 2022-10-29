import jwt from 'jsonwebtoken';
import Logger from '../log';


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
export const validateToken = async (token:string) => {
	try {
		const data = await jwt.verify(token, process.env.SECRET);
		return [null, data];
	} catch(error) {
		Logger.error(JSON.stringify(error));
		return [error.message, null];
	}
};