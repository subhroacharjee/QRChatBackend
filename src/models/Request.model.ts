import mongoose from 'mongoose';
import { mongooseRequestValidatorWrapper } from '../common/Validators/Requests';
import { IRequest } from '../interfaces/Model/Requets';

const RequestSchema = new mongoose.Schema<IRequest>({
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
	},
	handlerType: {
		type: String,
		default: 'PENDING',
		validate: {
			validator: mongooseRequestValidatorWrapper,
			message: props => `${props.value} not a valid type`
		}
	}
});

const RequestModel = mongoose.model('Request', RequestSchema);

export default RequestModel;