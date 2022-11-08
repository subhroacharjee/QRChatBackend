import _ from 'lodash';
import { Socket } from 'socket.io';
import { Default403Response, Default500Response } from '../common/Constants/DefaultErrStatus';
import { NextFunction, Request, Response } from 'express';
import { ListOfPathToIgnoreInAuthMiddleware, userObjectRequiredKeys } from '../common/Constants/PathConstants';
import { validateToken } from '../common/Auth/jwt';
import Logger from '../common/log';
import UserModel from '../models/User.model';

const AuthenticateRequest = async (req: Request, res: Response, next: NextFunction) => {

	// so if a path is not an api path or public path then this condition will pass.
	const err = Default403Response;
	if (!ListOfPathToIgnoreInAuthMiddleware.includes(req.path) && req.path.includes('/api')) {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader || !authorizationHeader.includes('Bearer ')) {
			const status = parseInt(err.error?._xstatus[0] || '403');
			delete err.error._xstatus;
			res.status(status)
				.json({
					status: 'failed',
					error: err.error
				});
			return;
		}
		
		try {
			const token = authorizationHeader.split('Bearer ')[1];
			const validationResult = await validateToken(token, userObjectRequiredKeys);
			if (validationResult.error !== null || !_.every(userObjectRequiredKeys, _.partial(_.has, validationResult.data))) {

				err.error.message = ['Invalid token'];
				const status = 403;
				delete err.error._xstatus;
				res.status(status)
					.json({
						status: 'failed',
						error: err.error
					});
				return;
			}

			const user = await UserModel.findById(validationResult.data._id).select(['-password', '-__v']).exec();
			if (user === null) {
				err.error.message = ['Invalid token'];
				const status = 403;
				delete err.error._xstatus;
				res.status(status)
					.json({
						status: 'failed',
						error: err.error
					});
				return;
			}

			req.headers.currentUser = JSON.stringify(user.toObject());			
		} catch (error) {
			Logger.error(error.message);
			const err = Default500Response;
			const status = parseInt(err.error._xstatus[0]);
			delete err.error._xstatus;
			res.status(status)
				.json({
					status: 'failed',
					error: err.error
				});
			return;
		}
		
	}
	next();
};

export const AuthenticateWSRequest = async (socket: Socket, next: (err?:any) => void) => {
	const authorizationHeader = socket.handshake.headers.authorization;
	try {
		const token = authorizationHeader.split('Bearer ')[1];
		const validationResult = await validateToken(token, userObjectRequiredKeys);
		if (validationResult.error !== null || !_.every(userObjectRequiredKeys, _.partial(_.has, validationResult.data))) {
			next(new Error('Invalid token'));
		}

		const user = await UserModel.findById(validationResult.data._id).select(['-password', '-__v']).exec();
		if (user === null) {
			next(new Error('Invalid token'));
		}

		socket.request.headers.currentUser = JSON.stringify(user.toJSON());
	} catch (error) {
		Logger.error(error.message);
		next(error);
		
	}
	next();
};

export default AuthenticateRequest;