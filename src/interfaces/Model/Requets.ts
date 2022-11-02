import { ObjectId } from 'mongoose';
import { UserInterface } from './User';

export type HandlerType = 'ACCEPTED' | 'DENIED' | 'PENDING';
export interface IRequest {
	_id?: ObjectId,
	sender?: UserInterface
	reciever?: UserInterface,
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
