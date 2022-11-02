import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { GetAllPendingRequests, SendRequests, handleRequest } from '../controllers/Requets.Controller';
import { createValidationErrorObject } from '../common/functions';
import { handleRequestValidators, sendRequestValidators } from '../common/Validators/Requests';
import { CurrentUser } from '../interfaces/Responses/Auth';
import Logger from '../common/log';
import { RequestHandleType } from '../interfaces/Model/Requets';

const RequestRouter = Router();

RequestRouter.get('/', (req: Request, res: Response) => {
	// returns the current queue of request;
	let currentUser:CurrentUser;
	if (req.headers.currentUser && typeof req.headers.currentUser === 'string') {
		currentUser = JSON.parse(req.headers.currentUser || '{}');

		GetAllPendingRequests(currentUser).then(response => {
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
	}
});

RequestRouter.post('/', sendRequestValidators, (req: Request, res: Response) => {
	// send the requests hence triggering sendRequest event
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const validationErrorObject = createValidationErrorObject(errors.array());

		res.status(400).json({
			status: 'failed',
			error: validationErrorObject
		});
		return;
	}

	let currentUser:CurrentUser;
	if (req.headers.currentUser && typeof req.headers.currentUser === 'string') {
		currentUser = JSON.parse(req.headers.currentUser || '{}');
	}

	SendRequests({
		uniqueId: req.body.uniqueId,
		currentUser: currentUser
	});
	res.json({
		status: 'success',
		data: {
			message: 'Request will be sent!'
		}
	});
});

RequestRouter.post('/:actionType', handleRequestValidators, (req: Request, res: Response) => {
	// accepts/rejects the requests hence triggering AcceptRequest/DeleteRequest event
	const actionType = req.params.actionType;
	if (typeof actionType !== 'string' || (actionType !== 'accept' && actionType !== 'deny')) {
		res.status(404).send();
		return;
	}
	let handleType: RequestHandleType;
	switch (actionType) {
	case 'accept':
		handleType = 'ACCEPTED';
		break;
	case 'deny':
		handleType = 'DENIED';
		break;
	}


	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const validationErrorObject = createValidationErrorObject(errors.array());

		res.status(400).json({
			status: 'failed',
			error: validationErrorObject
		});
		return;
	}

	let currentUser:CurrentUser;
	if (req.headers.currentUser && typeof req.headers.currentUser === 'string') {
		currentUser = JSON.parse(req.headers.currentUser || '{}');
	}

	handleRequest({
		currentUser,
		handleType: handleType,
		requestId: req.body.requestId
	});

	res.json({
		status: 'success',
		data: {
			message: 'request is handled'
		}
	});
});




export default RequestRouter;