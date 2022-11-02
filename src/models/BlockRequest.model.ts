import mongoose from 'mongoose';
import { IRequest } from '../interfaces/Model/Requets';

const BlockedRequestSchema = new mongoose.Schema<IRequest>({
	reciever: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	sender: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	created_at: {
		type: Date,
		default: new Date()
	},
	key: {
		type: String,
		required: true
	}
});

const BlockedRequestModel = mongoose.model('BlockedRequest', BlockedRequestSchema);

export default BlockedRequestModel;