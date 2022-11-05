import { ObjectId } from 'mongoose';
import { User } from './User';

export interface Message {
	_id?: ObjectId,
	sender: User,
	connectionKey: string,
	created_at: Date,
	message: string
}