import { ControllerReturnType } from '../../interfaces/Responses/Controller';

export const Default500Response:ControllerReturnType<null> = {
	error: {
		message: ['Something went wrong'],
		_xstatus: ['500']
	},
	data: null
};

export const Default403Response: ControllerReturnType<null> = {
	error: {
		message: ['You dont have access to this path'],
		_xstatus: ['403']
	},
	data: null
};