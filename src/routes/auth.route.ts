import * as AuthController from '../controllers/Auth.Controller';
import { CurrentUser } from '../interfaces/Responses/Auth';
import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { LoginValidator, RegisterValidator } from '../common/Validators/Auth';
import { createValidationErrorObject } from '../common/functions';
import Logger from '../common/log';

const AuthRouter =  Router();

AuthRouter.post('/signup', RegisterValidator, (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const validationErrorObject = createValidationErrorObject(errors.array());

		res.status(400).json({
			status: 'failed',
			error: validationErrorObject
		});
		return;
	}
	AuthController.register(req.body)
		.then(response => {
			if (response.error !== null) {
				const status = response.error._xstatus ? parseInt(response.error._xstatus[0]) : 400;
				delete response.error._xstatus;
				res.status(status).json({
					status: 'failed',
					error: response.error
				});
				return;
			}

			res.json({
				status: 'success',
				data: response.data
			});
		}).catch(err=>{
			Logger.error(JSON.stringify(err));
			res.status(500).json({
				success: 'failed',
				error: 'Something went wrong'
			});
		});
});

AuthRouter.post('/login', LoginValidator, (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const validationErrorObject = createValidationErrorObject(errors.array());

		res.status(400).json({
			status: 'failed',
			error: validationErrorObject
		});
		return;
	}
	AuthController.login(req.body)
		.then(response => {
			if (response.error !== null) {
				const status = response.error._xstatus ? parseInt(response.error._xstatus[0]) : 400;
				delete response.error._xstatus;
				res.status(status).json({
					status: 'failed',
					error: response.error
				});
				return;
			}

			res.json({
				status: 'success',
				data: response.data
			});
		}).catch(err=>{
			Logger.error(JSON.stringify(err));
			res.status(500).json({
				success: 'failed',
				error: 'Something went wrong'
			});
		});
});

AuthRouter.get('/user', (req, res) => {
	let currentUser:CurrentUser;
	if (req.headers.currentUser && typeof req.headers.currentUser === 'string') {
		currentUser = JSON.parse(req.headers.currentUser || '{}');
	}
	
	res.status(200).json({
		status: 'success',
		data: currentUser
	});
});

export { AuthRouter };