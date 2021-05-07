import React from 'react';
import axios  from 'axios';
import JoinChat from './components/JoinChat';
import Chat from './components/Chat';
import reducer from './reducer';
import socket from './socket';



function App() {
	const [state, dispatch] = React.useReducer(reducer, {
		joined: false,
		userName: null,
		roomId: null,
		users: [],
		messages: []
	});

	const setUsers = (users) => {
		dispatch({
			type: 'SET_USERS',
			payload: users,
		});
	}
	const setMessage = (message) => {
		dispatch({
			type: 'NEW_MESSAGE',
			payload: message,
		});
	}

	const onLogin = async (obj) => {
		dispatch({
			type: 'JOINED',
			payload: obj,
		});
		socket.emit('CHAT:JOIN', obj);
		const { data } = await axios.get(`/rooms/${obj.roomId}`);
		dispatch({
			type: 'SET_DATA',
			payload: data
		})
	};

	React.useEffect(() => {
		socket.on('CHAT:SET_USERS', setUsers);
		socket.on('CHAT:NEW_MESSAGE', setMessage);
	}, []);
	

	return (
		<div className='wrapper'>
			{!state.joined ? (
				<JoinChat onLogin={onLogin} />
			) : (
				<Chat {...state} setMessage={setMessage} />
			)}
		</div>
	);
}

export default App;
