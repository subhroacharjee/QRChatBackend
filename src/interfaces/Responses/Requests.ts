import { ObjectId } from 'mongoose';

export interface PendingObject {
	_id: ObjectId,
	username: string,
	uniqueId: string
}