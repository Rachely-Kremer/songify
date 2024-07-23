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
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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
      socket.off('game start');
      socket.off('next question');
      socket.off('game over');
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

  const submitAnswer = (answer: string) => {
    if (sessionId) {
      socket.emit('submit answer', answer, sessionId);
    }
  };

  return (
    <div>
      <button onClick={startGame}>Start Game</button>
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
      {currentQuestion && (
        <div>
          <p>{currentQuestion.question}</p>
          {currentQuestion.options?.map((option, index) => (
            <button key={index} onClick={() => submitAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;
