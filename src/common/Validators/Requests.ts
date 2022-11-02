import { check } from 'express-validator';
import { HandlerType } from '../../interfaces/Model/Requets';

export const validateRequestHandlerType = (requestHandler: unknown): HandlerType => {
	if (!requestHandler || typeof requestHandler!== 'string') {
		throw new Error('Invalid request handler type');
	}

	switch (requestHandler.toUpperCase()) {
	case 'ACCEPTED':
	case 'DENIED':
	case 'PENDING':
		return <HandlerType>requestHandler.toUpperCase();
	default:
		throw new Error('Invalid request handler type');
			
	}
};

export const mongooseRequestValidatorWrapper = (requestHandler: unknown) => {
	try {
		validateRequestHandlerType(requestHandler);
		return true;
	} catch (error) {
		return false;
	}
};

export const sendRequestValidators = [
	check('uniqueId').notEmpty().isString().trim().custom((val) => val.startsWith('#'))
];

export const handleRequestValidators = [
	check('requestId').notEmpty().isString().trim().isLength({min: 16}).isHexadecimal().withMessage('Invalid request id')
];