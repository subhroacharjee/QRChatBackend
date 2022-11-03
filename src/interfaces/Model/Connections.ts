import { ObjectId } from 'mongoose';
import { UserInterface } from './User';

export interface Connection {
	_id?: ObjectId,
	u1_id: UserInterface,
	u2_id: UserInterface,
	key: string
	created_at?: Date 
}