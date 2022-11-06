import express, { Router } from 'express';
import Logger from '../common/log';
import { GetAllConnectionWithMessage, GetMessages } from '../controllers/Message.controller';
import { CurrentUser } from '../interfaces/Responses/Auth';

const MessageRouter = Router();

MessageRouter.get('/userList', (req: express.Request, res: express.Response) => {
	const currentUser = req.headers.currentUser;
	if (currentUser && typeof currentUser === 'string') {
		GetAllConnectionWithMessage(JSON.parse(currentUser))
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
			})
			.catch(err => {
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

MessageRouter.get('/', (req: express.Request, res: express.Response) => {
	let roomKeys:string[];
	if (req.query.roomKeys && typeof req.query.roomKeys === 'string') {
		try {
			roomKeys = JSON.parse(req.query.roomKeys);
		} catch (error) {
			roomKeys = [];
		}
	}

	let skip:number;
	if (req.query.skip && typeof req.query.skip === 'number') {
		skip = req.query.skip;
	}

	const currentUser = req.headers.currentUser;
	if (currentUser && typeof currentUser === 'string') {
		GetMessages(JSON.parse(currentUser), roomKeys, skip)
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
			})
			.catch(err => {
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

export default MessageRouter;