import { ObjectId } from 'mongoose';

export interface ConnectionObject {
	_id: ObjectId,
	username: string,
	uniqueId: string,
	connectionKey: string
}