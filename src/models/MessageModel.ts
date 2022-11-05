import mongoose from 'mongoose';
import { Message } from '../interfaces/Model/Message';

const MessageSchema = new mongoose.Schema<Message>({
	sender: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	connectionKey: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default:  new Date()
	}
});

const MessageModel = mongoose.model('Message', MessageSchema);
export default MessageModel;