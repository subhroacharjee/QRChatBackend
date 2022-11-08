import { ObjectId } from 'mongoose';
import { IUserShort } from '../Model/User';


export interface Message {
	_id: ObjectId,
	message: string,
	sender: IUserShort,
	created_at: Date
}

export interface MessageResponseObject {
	[connectionKey: string] : Message[]
}

export interface MessageUserInterface {
	_id: ObjectId
	user: IUserShort,
	connectionKey: string
}