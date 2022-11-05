import { Server } from 'http';
import { Socket, Server as SocketServer } from 'socket.io';
import { AuthenticateWSRequest } from '../middlewares/Auth';
import Logger from '../common/log';
import { EventCallBack, EventMappingObject } from '../interfaces/EventMapper';

class SocketManagerSingleton {
	private server: Server;
	private Io: SocketServer;
	private socket: Socket;
	private static _instance: SocketManagerSingleton =  new SocketManagerSingleton();

	private EventMap: EventMappingObject = {} as EventMappingObject;

	constructor() {
		if (!SocketManagerSingleton._instance) {
			SocketManagerSingleton._instance = this;
		}
	}

	public static getInstance(): SocketManagerSingleton {
		return SocketManagerSingleton._instance;
	}

	public setServer = (server: Server) =>{
		this.server = server;
		this.Io = new SocketServer(this.server, {
			cors: {
				origin: '*'
			}
		});
		this.Io.use(AuthenticateWSRequest);
		this.Io.on('connection', (socket) =>{
			Logger.info('ws connection Up');
			

			for (const eventKey in this.EventMap) {
				socket.on(eventKey, (data) => {
					this.EventMap[eventKey](socket, data);
				});
			}
		});
	};

	public getSocket = () => this.socket;

	public getIo = () => this.Io;

	public setPublicEvent = (event: string, _callback: EventCallBack) => {
		this.EventMap[event] = _callback;
	};

	public setEvent = (event: string, _callback: EventCallBack) => {
		this.EventMap[event] = _callback;
	};

}

const SocketManager = SocketManagerSingleton.getInstance();

export default SocketManager;