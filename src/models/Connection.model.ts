import mongoose from 'mongoose';
import {Connection} from '../interfaces/Model/Connections';

const ConnectioSchema = new mongoose.Schema<Connection>({
	u1_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	u2_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	key: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: new Date()
	}
});

const ConnectionModel = mongoose.model('Connection', ConnectioSchema);

export default ConnectionModel;