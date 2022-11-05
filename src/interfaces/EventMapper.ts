import { Socket } from 'socket.io';
import { CurrentUser } from './Responses/Auth';

export type EventCallBack = (socket: Socket, data: any) => void;

export interface EventMappingObject {
	[key:string]: EventCallBack
}