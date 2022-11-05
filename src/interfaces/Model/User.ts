import { Types } from 'mongoose';

export interface User {
	_id?: Types.ObjectId,
	username: string,
	email: string,
	password: string,
	avatar?: string,
	created_at?: Date,
}

export interface IUserShort {
	_id: Types.ObjectId,
	username: string,
	avatar?: string
}