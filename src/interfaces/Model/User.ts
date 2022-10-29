import { Types } from 'mongoose';

export interface UserInterface {
	_id?: Types.ObjectId,
	username: string,
	email: string,
	password: string,
	avatar?: string,
	created_at?: Date,
}