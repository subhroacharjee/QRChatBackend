import { Types } from 'mongoose';

export interface UserResponse {
	_id: Types.ObjectId,
	username: string,
	email: string,
	avatar?: string,
	created_at: Date,
	access_token: string
}

export interface CurrentUser {
	_id: Types.ObjectId,
	username: string,
	email: string,
	avatar?: string,
	created_at: Date,
}