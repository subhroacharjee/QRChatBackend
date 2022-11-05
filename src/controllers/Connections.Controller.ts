import {  Types } from 'mongoose';
import { CurrentUser } from '../interfaces/Responses/Auth';
import Logger from '../common/log';
import ConnectionModel from '../models/Connection.model';
import { ControllerReturnType } from '../interfaces/Responses/Controller';
import RequestModel from '../models/Request.model';
import { Default500Response } from '../common/Constants/DefaultErrStatus';
import { HandlerEnum } from '../interfaces/Model/Requets';
import { ConnectionObject } from '../interfaces/Responses/Connection';
import MessageModel from '../models/MessageModel';

export const CreateConnection = async (payload: {_uid1: string , _uid2: string, key:string}) => {
	try {
		const uid1 = new Types.ObjectId(payload._uid1);
		const uid2 = new Types.ObjectId(payload._uid2);

		const newConnection = new ConnectionModel({
			u1_id: uid1,
			u2_id: uid2,
			key: payload.key
		});

		const newConnection2 = new ConnectionModel({
			u1_id: uid2,
			u2_id: uid1,
			key: payload.key
		});
		const connectionResult = await Promise.all([newConnection.save(), newConnection2.save()]);

		// TODO: find a better way to handle this.
		if(connectionResult[0] === null && connectionResult[1] === null) {
			return false;
		} else if (connectionResult[0]!== null && connectionResult[1] === null) {
			await connectionResult[0].delete();
			return false;
		} else if (connectionResult[0] === null && connectionResult[1] !== null) {
			await connectionResult[1].delete();
			return false;
		}
		return true;
	} catch (err) {
		Logger.error(err.message);
		console.error(err);

		return false;
		
	}
};

export const DeleteConnection = async (payload: {
	currentUser: CurrentUser,
	connectionKey: string
}): Promise<ControllerReturnType<string>> => {
	try {

		const countRequest = await ConnectionModel.find({
			key: payload.connectionKey,
		}).count().exec();
		if (countRequest === 0) return {
			error: {
				message: 'Invalid key provided'
			},
			data: null
		};


		await RequestModel.deleteMany({
			key: payload.connectionKey
		}).where('handlerType').in([HandlerEnum.ACCEPTED, HandlerEnum.PENDING])
			.exec();

		await MessageModel.deleteMany({
			connectionKey: payload.connectionKey
		}).exec();

		await ConnectionModel.deleteMany({
			key: payload.connectionKey
		}).exec();

		return {
			data: 'Connection has been deleted',
			error: null
		};
	} catch (error) {
		Logger.error(error.message);
		console.error(error);
		return Default500Response;
		
	}
};

export const ListConnection = async(currentUser: CurrentUser): Promise<ControllerReturnType<ConnectionObject[]>> => {
	try {
		const connectionList = await ConnectionModel.find({
			u1_id: currentUser._id
		}).populate({
			path: 'u2_id',
			select: 'username'
		}).exec();

		const listOfConnection:ConnectionObject[] = connectionList.map(conn => ({
			_id: conn._id,
			username: conn.u2_id.username,
			uniqueId: '#' + conn.u2_id.username,
			connectionKey: conn.key
		}));

		return {
			error: null,
			data: listOfConnection
		};
	} catch (error) {
		Logger.error(error.message);
		console.error(error);

		return Default500Response;
	}
};