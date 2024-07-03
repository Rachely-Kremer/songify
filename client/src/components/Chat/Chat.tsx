import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('Sending message: ', messageInput); // הוסף לוג כאן
      socket.emit('chat message', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form id="form" onSubmit={sendMessage}>
        <input
          id="input"
          autoComplete="off"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Chat;