import axios from 'axios';
import React from 'react';



export default function JoinChat({ onLogin }) {
	const [roomId, setRoomId] = React.useState('');
	const [userName, setUserName] = React.useState('');
	const [isLoading, setLoading] = React.useState(false);

	const onEnter = async () => {
		if (!roomId || !userName) {
			return alert('Enter name for create chat');
		}
		const obj = {
			userName,
			roomId,
		};
		setLoading(true)
		await axios.post('/rooms', obj);
		onLogin(obj);
	};

	return (
		<div>
			<div className='join-chat'>
				<input
					type='text'
					placeholder='Room ID'
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Your name'
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<button disabled={isLoading} className='btn btn-primary' onClick={onEnter}>
					{isLoading ? 'Logining to the chat...': 'Log in to the chat'}
				</button>
			</div>
		</div>
	);
}


