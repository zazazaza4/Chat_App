import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './App.css';

function App() {
  const [socketId, setSocketId] = useState('');
  const [message, setMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [room, setRoom] = useState('');
  const [chat, setChat] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const socket = io('http://localhost:5000');

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  useEffect(() => {
    socket.on('me', (id) => {
      setSocketId(id);
    });

    socket.on('disconnect', () => {
      socket.disconnect();
    });

    socket.on('getAllUsers', (users) => {
      setUsers(users);
    });

    socket.on('updateUsers', (users) => {
      setUsers(users);
    });
  }, [chat, room]);

  return <div className="App"></div>;
}

export default App;
