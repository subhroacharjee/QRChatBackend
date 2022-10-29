import { check } from 'express-validator';

export const LoginValidator = [
	check('email').isEmail().notEmpty().withMessage('Your Email is not valid').normalizeEmail(),
	check('password').isString().trim().notEmpty().withMessage('Password field is required'),
	check('password').isString().trim().isLength({min:1}).withMessage('Password field is required'),
	check('remember').isBoolean().withMessage('Remember parameter is invalid')
];

export const RegisterValidator = [
	check('username').isString().trim().isLength({min:1}).notEmpty(),
	check('email').isEmail().notEmpty().withMessage('Your Email is not valid').normalizeEmail(),
	check('password').isString().trim().notEmpty().withMessage('Password field is required'),
	check('password').isString().trim().isLength({min: 8}).withMessage('Minimum of 8 characters are required'),
];

