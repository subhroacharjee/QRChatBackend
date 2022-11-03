import { check } from 'express-validator';

export const validateDeleteConnection = [
	check('connectionKey').notEmpty().isString().isLength({min: 3}).custom((val) =>	typeof val === 'string' && val.includes('#'))
];