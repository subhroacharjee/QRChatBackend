import ConnectionModel from '../models/Connection.model';
import { CurrentUser } from '../interfaces/Responses/Auth';
import { Socket } from 'socket.io';
import Logger from '../common/log';
import { MessagePayload } from '../interfaces/Requests/Message';
import MessageModel from '../models/MessageModel';

import * as Events from '../common/Constants/Events';
import { ControllerReturnType } from '../interfaces/Responses/Controller';
import { Message, MessageResponseObject } from '../interfaces/Responses/Message';
import { IUserShort } from '../interfaces/Model/User';
import _ from 'lodash';


export const JoinChatRoomsController = async(currentUser: CurrentUser, socket: Socket) => {
	try {
		const connectionKeyList = await ConnectionModel.find({
			u1_id: currentUser._id
		}).select('key').exec();

		for (const index in connectionKeyList) {
			const key = connectionKeyList[index].key;
			socket.join(key);
		}
		socket.emit(Events.JOIN_SUCCESS);
	} catch (error) {
		console.error(error);
		Logger.error(error.message);
		socket.emit(Events.JOIN_ERR_EVENT);
	}
};

export const HandleMessageEventController = async(currentUser: CurrentUser, messagePayload: MessagePayload, socket: Socket) => {
	const connectionKey = messagePayload.connectionKey;

	const msg = messagePayload.message.trim();
	if (msg.length  < 1) return;

	

	try {
		const countConnection = await ConnectionModel.find({
			u1_id: currentUser._id,
			key: connectionKey
		}).count().exec();

		if (countConnection > 0) {
			const newMessage = new MessageModel({
				sender: currentUser._id,
				connectionKey: connectionKey,
				message: msg
			});
			await newMessage.save();

			socket.in(connectionKey).emit(Events.MESSAGE_EVENT, newMessage.toJSON());
		}
	} catch (error) {
		console.error(error);
		Logger.error(error.message);
		socket.emit(Events.MESSAGE_ERROR_EVENT);
	}
};

export const GetMessages = async(currentUser: CurrentUser, roomKeys?: string[], skip?:number): Promise<ControllerReturnType<MessageResponseObject>> => {

	// 1. get all the roomKey user has access to
	// 2. filter out the roomKey which are not asked of in response
	// 3. if roomKey is undefined or empty assign all the values.
	// 4. find all the messages
	// 5. group by the key using lodash or if possible mongoose itsefl
	let validatedRoomKeys: string[] = [];

	const connKeyList = (await ConnectionModel.find({
		u1_id: currentUser._id
	}).select('key').exec());

	if (roomKeys && roomKeys.length > 0) {
		// if the roomkey is valid or not.
		validatedRoomKeys = _.filter(roomKeys, (roomKey) => _.findIndex(connKeyList, (doc) => doc.key === roomKey) !== -1);
	} else {
		validatedRoomKeys = _.map(connKeyList, (doc) => doc.key);
	}


	const unGroupedMessageList = await MessageModel.find()
		.where('connectionKey')
		.in(validatedRoomKeys)
		.populate({
			path: 'sender',
			select: '_id username'
		})
		.select('sender message connectionKey created_at')
		.sort('-created_at')
		.limit(1000)
		.skip(skip || 0)
		.exec();

	const groupedMessageObject =_.groupBy(unGroupedMessageList, 'connectionKey');
	
	const messages: MessageResponseObject = {} as MessageResponseObject;


	_.forEach(groupedMessageObject, (value, key) => {
		messages[key] = _.map(value, (doc) => ({
			sender: <IUserShort>doc.sender,
			message: doc.message.trim(),
			created_at: doc.created_at
		}));
	});

	return {
		data: messages,
		error: null
	};
};