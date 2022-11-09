import AuthenticateRequest from './middlewares/Auth';
import BaseRouter from './routes';
import Cors from 'cors';
import Database from './common/db';
import Logger from './common/log';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createServer } from 'http';
import SocketManager from './socket';
import EventRouteLoader from './routes/WebsocketEvents';

// loading .env to process.env
config();

const PORT = process.env?.PORT || 8000;
Database.connect({
	url: process.env.DB_URI,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	dbName: process.env.DB_NAME,
	host: process.env.DB_HOST
});


const app = express();

app.disable('etag');
app.use(Cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(AuthenticateRequest);
app.use(bodyParser.json());

app.get('/_healthcheck', (_req, res) => {
	res.status(200).json({
		uptime: process.uptime()
	});
});

app.use('/api', BaseRouter);

const server = createServer(app);
SocketManager.setServer(server);
EventRouteLoader();

server.listen(PORT, () => {
	Logger.info('App started at port ' + PORT);
});


