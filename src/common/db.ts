import mongoose from 'mongoose';
import { DbConnectionPayload } from '../interfaces/Connection';
import Logger from './log';

class DatabaseConnection {
	connection = mongoose.connection;

	constructor() {
		try {
			this.connection
				.on('open', console.info.bind(console, 'Database connection: open'))
				.on('close', console.info.bind(console, 'Database connection: close'))
				.on('disconnected', console.info.bind(console, 'Database connection: disconnecting'))
				.on('disconnected', console.info.bind(console, 'Database connection: disconnected'))
				.on('reconnected', console.info.bind(console, 'Database connection: reconnected'))
				.on('fullsetup', console.info.bind(console, 'Database connection: fullsetup'))
				.on('all', console.info.bind(console, 'Database connection: all'))
				.on('error', console.error.bind(console, 'MongoDB connection: error:'));
		} catch (error) {
			Logger.error(JSON.stringify(error));
		}
	}

	async connect(connectionPayload: DbConnectionPayload) {
		let dbUri = '';
		if (!connectionPayload.url ) {
			if (!connectionPayload.username || !connectionPayload.password || !connectionPayload.dbName || !connectionPayload.host )
				throw new Error('Insufficent parameters passed for db connection');
			dbUri = `mongodb+srv://${connectionPayload.username}:${connectionPayload.password}@${connectionPayload.host}/${connectionPayload.dbName}?retryWrites=true&w=majority`;
		} else {
			dbUri = connectionPayload.url;
		}

		try {
			await mongoose.connect(dbUri);
		} catch (error) {
			Logger.error(JSON.stringify(error));
		}
	}
}
const Database = new DatabaseConnection();

export default Database;
