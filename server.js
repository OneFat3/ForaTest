const express = require('express');


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

app.use(express.json());

//fake DB
const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId) ? {
			users: [...rooms.get(roomId).get('users').values()],
			messages: [...rooms.get(roomId).get('messages').values()],
		} : {users: [], messages: []};

  res.json(obj);
});

app.post('/rooms', (req, res) => {
  const { roomId } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(roomId,
      new Map([
        ['users', new Map()],
        ['messages', []]
      ])
    );
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('CHAT:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.broadcast.to(roomId).emit('CHAT:SET_USERS', users);
  });

  socket.on('CHAT:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = { userName, text };
    rooms.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit('CHAT:NEW_MESSAGE', obj);
		});

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
				socket.broadcast.to(roomId).emit('CHAT:SET_USERS', users);
      }
    });
  });


  console.log('user connected:  ', socket.id);
});

server.listen(4545, (err) => {
  if (err) {
    throw Error(err);
  };
  console.log('Server startet on 4545 port');
});