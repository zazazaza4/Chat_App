const app = require('express')();
const server = require('http').createServer(app);
const PORT = 5000;
const { nanoid } = require('nanoid');

const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

const users = [];
const rooms = [];

io.on('connection', (socket) => {
  socket.emit('me', socket.id);
  users.push(socket.id);

  socket.broadcast.emit('updateUsers', users);

  socket.on('disconnect', () => {
    users = users.filter((users) => users !== socket.id);
    socket.broadcast.emit('updateUsers', users);
    socket.disconnect();
  });

  socket.emit('getAllUsers', users);

  socket.on('create_room', () => {
    const room = {
      id: nanoid(7),
      chat: []
    };

    socket.join(room);
    socket.emit('get_room', room);
    rooms.push(room);
    socket.broadcast.emit('updateRooms', rooms);
  });

  socket.on('join_room', (room) => {
    socket.join(room.id);
  });

  socket.broadcast.emit('updateRooms', rooms);

  socket.on('message', (payload) => {
    rooms.map((room) => {
      if (room.id === payload.room) {
        const singleChat = { message: payload.message, writer: payload.socketId };
        rooms.chat.push(singleChat);
      }
    });

    io.to(payload.room).emit('chat', payload);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
