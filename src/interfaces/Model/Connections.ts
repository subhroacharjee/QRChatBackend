import { ObjectId } from 'mongoose';
import { User } from './User';

export interface Connection {
	_id?: ObjectId,
	u1_id: User,
	u2_id: User,
	key: string
	created_at?: Date 
}