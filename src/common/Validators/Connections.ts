import { check } from 'express-validator';

export const validateDeleteConnection = [
	check('connectionKey').notEmpty().isString().isLength({min: 3}).custom((val) =>	typeof val === 'string' && val.includes('#'))
];

export const validateConnectionKey = (key: unknown) => {
	if (typeof key !== 'string') return false;
	if (!key.includes('#')) return false;
	if (key.length  < 3) return false;

	return true;
};