import React from 'react';
import socket from '../socket';

export default function Chat({ users, messages, userName, roomId, setMessage }) {
	const [messageValue, setMessageValue] = React.useState("");
	const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    if (!messageValue) {
      alert('Enter message')
    } else {socket.emit("CHAT:NEW_MESSAGE", {
						userName,
						roomId,
						text: messageValue,
					});
		setMessage({ userName, text: messageValue });
		setMessageValue("");}
	};

	React.useEffect(() => {
		messagesRef.current.scrollTo(0, 1000);
	}, [messages]);

	return (
		<div className="chat">
			<div className="chat-users">
				Room №: <b>{roomId}</b>
				<hr />
				<b>Online ({users.length}):</b>
				<ul>
					{users.map((name, index) => (
						<li key={name + index}>{name}</li>
					))}
				</ul>
			</div>
			<div className="chat-messages">
				<div ref={messagesRef} className="messages">
					{messages.map((message) => (
						<div className="message">
							<p>{message.text}</p>
							<div>
								<span>{message.userName}</span>
							</div>
						</div>
					))}
				</div>
				<form>
					<textarea
						value={messageValue}
						onChange={(e) => setMessageValue(e.target.value)}
						className="form-control"
						rows="3"
					></textarea>
					<button onClick={onSendMessage} type="button" className="btn btn-primary">
						Send
					</button>
				</form>
			</div>
		</div>
	);
}