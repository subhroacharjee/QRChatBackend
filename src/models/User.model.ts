import {Schema, model} from 'mongoose';
import { User } from '../interfaces/Model/User';


export const UserSchema = new Schema <User>({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String
		// TODO: add default string once CDN is setted up
	},
	created_at: {
		type: Date,
		default: new Date()
	}
});

export default model<User>('User', UserSchema);

