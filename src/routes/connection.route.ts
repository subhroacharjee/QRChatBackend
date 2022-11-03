import express, { Router } from 'express';
import { validateDeleteConnection } from '../common/Validators/Connections';
import Logger from '../common/log';
import { DeleteConnection, ListConnection } from '../controllers/Connections.Controller';
import { CurrentUser } from '../interfaces/Responses/Auth';
import { validationResult } from 'express-validator';
import { createValidationErrorObject } from '../common/functions';

const ConnectionRouter = Router();

ConnectionRouter.get('/', (req: express.Request, res: express.Response) => {
	let currentUser:CurrentUser;
	if (req.headers.currentUser && typeof req.headers.currentUser === 'string') {
		currentUser = JSON.parse(req.headers.currentUser || '{}');

		ListConnection(currentUser).
			then(response => {
				if (response.error!== null) {
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
			}).catch(err => {
				Logger.error(JSON.stringify(err));
				res.status(500).json({
					success: 'failed',
					error: 'Something went wrong'
				});
			});
	}else {
		res.status(403).send();
	}

	
});

ConnectionRouter.delete('/', validateDeleteConnection, (req: express.Request, res: express.Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const validationErrorObject = createValidationErrorObject(errors.array());

		res.status(400).json({
			status: 'failed',
			error: validationErrorObject
		});
		return;
	}
	const connectionKey = req.body.connectionKey;
	let currentUser:CurrentUser;
	if (req.headers.currentUser && typeof req.headers.currentUser === 'string') {
		currentUser = JSON.parse(req.headers.currentUser || '{}');

		DeleteConnection({
			currentUser,
			connectionKey
		}).
			then(response => {
				if (response.error!== null) {
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
			}).catch(err => {
				Logger.error(JSON.stringify(err));
				res.status(500).json({
					success: 'failed',
					error: 'Something went wrong'
				});
			});
	} else {
		res.status(403).send();
	}
});

export default ConnectionRouter;