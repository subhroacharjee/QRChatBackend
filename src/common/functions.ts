import {ValidationError} from 'express-validator';
import { ValidationErrorIF } from '../interfaces/Responses/ValidationError';

export const createValidationErrorObject = (errorArr: ValidationError[]): ValidationErrorIF => {
	const validationErrorObject = {} as ValidationErrorIF;

	for (const index in errorArr) {
		if (!validationErrorObject[errorArr[index].param]) {
			validationErrorObject[errorArr[index].param] = [errorArr[index].msg];
		} else {
			validationErrorObject[errorArr[index].param].push(errorArr[index].msg);
		}
	}

	return validationErrorObject;
};

export const createMongooseValidationError = (err:any) => {
	const validationErrorObject = {} as ValidationErrorIF;
	if (err.name == 'ValidationError') {
		for (const field in err.errors) {
			validationErrorObject[field] = [err.errors[field].message];
		}
	} else if (err.message && typeof err.message === 'string' && err.message.includes('duplicate key error')) {
		const fields: string[] = Object.getOwnPropertyNames(err.keyPattern || {});
		if (fields.length < 1) return null;
		for (const index in fields) {
			const field = fields[index];
			validationErrorObject[field] = [`This ${field} already exists`];
		}
	} else return null;
	
	return validationErrorObject;
};