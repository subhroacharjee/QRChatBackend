import { validateConnectionKey } from '../../common/Validators/Connections';
import { HandleMessageEventController, JoinChatRoomsController } from '../../controllers/Message.controller';
import SocketManager from '../../socket';
import * as Events from '../../common/Constants/Events';

const MessageEventRoute = () => {
	SocketManager.setEvent(Events.JOIN_EVENT, async (socket, data) => {
		console.log('Joined!');
		const currUser = socket.request.headers.currentUser;
		if (typeof currUser === 'string') {
			await JoinChatRoomsController(JSON.parse(currUser), socket);
		}
	});

	SocketManager.setEvent(Events.MESSAGE_EVENT, async (socket, data) => {
		console.log(data);
		
		const currUser = socket.request.headers.currentUser;
		if (!data || !data.message || typeof data.message !== 'string') {
			socket.emit(Events.MESSAGE_ERROR_EVENT, {
				err: {
					message: 'Invalid message'
				}
			});

			return;
		}

		if (!validateConnectionKey(data.connectionKey)) {
			socket.emit(Events.MESSAGE_ERROR_EVENT, {
				err: {
					message: 'Invalid payload'
				}
			});
			return;
		}
		if (typeof currUser === 'string') {
			await HandleMessageEventController(JSON.parse(currUser), {
				message: data.message,
				connectionKey: data.connectionKey
			},socket);
		}

	});
};

export default MessageEventRoute;
