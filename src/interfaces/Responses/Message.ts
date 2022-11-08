import { IUserShort } from '../Model/User';


export interface Message {
	message: string,
	sender: IUserShort,
	created_at: Date
}

export interface MessageResponseObject {
	[connectionKey: string] : Message[]
}

export interface MessageUserInterface {
	user: IUserShort,
	connectionKey: string
}