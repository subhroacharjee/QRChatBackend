import { ControllerReturnType } from '../interfaces/Responses/Controller';
import { CurrentUser } from '../interfaces/Responses/Auth';
import { PendingObject } from '../interfaces/Responses/Requests';
import RequestModel from '../models/Request.model';
import UserModel from '../models/User.model';
import Logger from '../common/log';
import BlockedRequestModel from '../models/BlockRequest.model';
import { HandlerEnum, RequestHandleType } from '../interfaces/Model/Requets';
import _ from 'lodash';
import { Default500Response } from '../common/Constants/DefaultErrStatus';

export const GetAllPendingRequests = async (currentUser: CurrentUser): Promise<ControllerReturnType<PendingObject[]>> => {
	try {
		const pendingRequests = await RequestModel.find({
			reciever:{
				_id: currentUser._id
			},
			handlerType: 'PENDING'
		})
			.populate({
				path: 'sender',
				select: 'username email'
			})
			.exec();
		
		const pendingObjectArr: PendingObject[] = [];

		for (const index in pendingRequests) {
			const doc = pendingRequests[index];
			pendingObjectArr.push({
				_id: doc._id,
				username: doc.sender.username,
				uniqueId: `#${doc.sender.username}`
			});
		}
		
		return {
			error: null,
			data: pendingObjectArr
		};
	} catch (error) {
		Logger.error(error.message);
		return Default500Response;
	}
};

export const SendRequests =  async (payload: {
	uniqueId: string,
	currentUser: CurrentUser
}): Promise<void> => {

	try {
		const recieverUserName = payload.uniqueId.substring(1);
		const reciever = await UserModel.findOne({
			username: recieverUserName
		}).select(['-password', '-__v']).exec();

		if (reciever && reciever._id !== payload.currentUser._id) {
			const key = `${payload.currentUser.username}#${reciever.username}`;
			const countBlockedListCount =  await BlockedRequestModel.find({
				key: key
			}).count().exec();

			const countRequest = await RequestModel.find({
				key: key,
			}).where('handlerType').exec();

			const groupedRequestByHandlerType = _.groupBy(countRequest, 'handlerType');

			const countAcceptedRequest = groupedRequestByHandlerType[HandlerEnum.ACCEPTED]?.length || 0;
			const countDeclinedRequest = groupedRequestByHandlerType[HandlerEnum.DENIED]?.length || 0;
			const countPendingRequest = groupedRequestByHandlerType[HandlerEnum.PENDING]?.length || 0;
			

			if (countBlockedListCount < 1 && countAcceptedRequest < 1 && countPendingRequest < 1 && countDeclinedRequest < 4 ) {
				const newRequest = new RequestModel({
					reciever: reciever._id,
					sender: payload.currentUser._id,
					handlerType: 'PENDING',
					key
				});

				await newRequest.save().catch(err => {
					Logger.error(err.message);
					return null;
				});

				if (newRequest === null) {
					Logger.info('New request is not created');
				}
			}

			if (countDeclinedRequest > 3) {
				const newBlockedRequest = new BlockedRequestModel({
					key,
					reciever: reciever._id,
					sender: payload.currentUser._id
				});

				await newBlockedRequest.save().catch(err => {
					Logger.error(err);
					return null;
				});

			}
			
		}
		

	} catch (error) {
		Logger.error(error.message);
	}

};

export const handleRequest = async (payload: {
	currentUser: CurrentUser,
	requestId: string,
	handleType: RequestHandleType
}): Promise<void> => {
	try {
		const theRequest = await RequestModel.findById(payload.requestId)
			.populate({
				path: 'sender',
				select: '_id username email'
			})
			.exec();
		
		if (theRequest !== null && theRequest.handlerType === 'PENDING') {
			theRequest.handlerType = payload.handleType;
			await theRequest.save();

			if (payload.handleType === 'ACCEPTED') {
				// TODO: add connection between the two users
				// 2 model will be created hence the model for connection
				
				const reverseKey = theRequest.key.split('#').reverse().join('#');
				await BlockedRequestModel.deleteMany({
					key: reverseKey
				}).exec();

				await RequestModel.deleteMany({
					key: reverseKey
				}).where('handlerType').in([HandlerEnum.DENIED, HandlerEnum.PENDING])
					.exec();
			}
			Logger.debug('Connection is ' + payload.handleType);
			return;
		}
	} catch (error) {
		Logger.error(error.message);
	}
};