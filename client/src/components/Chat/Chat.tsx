import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<{ msg: string, type: string }[]>([]);
  const [question, setQuestion] = useState<{ question: string, options: string[] } | null>(null);
  const [waiting, setWaiting] = useState<string | null>(null);

  useEffect(() => {
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, { msg, type: 'chat' }]);
    });

    socket.on('waiting', (msg: string) => {
      setWaiting(msg);
    });

    socket.on('start', () => {
      setWaiting(null);
    });

    socket.on('question', (q: { question: string, options: string[] }) => {
      setQuestion(q);
      setMessages((prevMessages) => [...prevMessages, { msg: q.question, type: 'question' }]);
    });

    socket.on('showAnswers', (answers: { player: string, answer: string }[]) => {
      answers.forEach(answer => {
        setMessages((prevMessages) => [...prevMessages, { msg: `${answer.player}: ${answer.answer}`, type: 'answer' }]);
      });
      setQuestion(null);
    });

    socket.on('end', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, { msg, type: 'chat' }]);
    });

    return () => {
      socket.off('chat message');
      socket.off('waiting');
      socket.off('start');
      socket.off('question');
      socket.off('showAnswers');
      socket.off('end');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      socket.emit('chat message', messageInput);
      setMessageInput('');
    }
  };

  const startGame = () => {
    socket.emit('start game');
  };

  const answerQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && question) {
      socket.emit('answer', { answer: messageInput });
      setMessageInput('');
    }
  };

  return (
    <div>
      {waiting && <p>{waiting}</p>}
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index} className={message.type}>
            {message.msg}
          </li>
        ))}
      </ul>
      {question ? (
        <form id="form" onSubmit={answerQuestion}>
          <input
            id="input"
            autoComplete="off"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button>Submit Answer</button>
        </form>
      ) : (
        <form id="form" onSubmit={sendMessage}>
          <input
            id="input"
            autoComplete="off"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button>Send</button>
        </form>
      )}
      {!question && <button onClick={startGame}>Start a new game</button>}
    </div>
  );
};

export default Chat;
