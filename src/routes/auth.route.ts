import { Router } from 'express';

const AuthRouter =  Router();

AuthRouter.post('/signup', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			message: 'working'
		}
	});
});

AuthRouter.post('/login', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			message: 'working'
		}
	});
});

// TODO: add Auth middleware
AuthRouter.post('/user', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			message: 'working'
		}
	});
});

export { AuthRouter };