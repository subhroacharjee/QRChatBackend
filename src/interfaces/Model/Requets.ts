import { ObjectId } from 'mongoose';
import { User } from './User';

export type HandlerType = 'ACCEPTED' | 'DENIED' | 'PENDING';
export interface IRequest {
	_id?: ObjectId,
	sender?: User
	reciever?: User,
	key: string,
	created_at: Date,
	handlerType: HandlerType
}

export enum HandlerEnum {
	'ACCEPTED' = 'ACCEPTED',
	'DENIED' = 'DENIED',
	'PENDING' = 'PENDING'
}

export type RequestHandleType = 'ACCEPTED' | 'DENIED';
