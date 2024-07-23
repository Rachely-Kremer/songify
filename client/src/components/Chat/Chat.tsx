import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

interface Question {
  question: string;
  answer: string;
  options?: string[];
}

const Chat: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

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

    socket.on('game start', ({ sessionId, question }: { sessionId: string, question: Question }) => {
      setSessionId(sessionId);
      setCurrentQuestion(question);
    });

    socket.on('next question', (question: Question) => {
      setCurrentQuestion(question);
    });

    socket.on('game over', () => {
      setCurrentQuestion(null);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      socket.emit('chat message', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div>
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index} className={message.type}>
            {message.msg}
          </li>
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
