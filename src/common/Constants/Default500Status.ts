import { ControllerReturnType } from '../../interfaces/Responses/Controller';

export const Default500Response:ControllerReturnType<null> = {
	error: {
		message: ['Something went wrong'],
		_xstatus: ['500']
	},
	data: null
};