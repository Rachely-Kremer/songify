import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import io from 'socket.io-client';
import './Chat.css';
import { Message } from '../../Types/question.type';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const socket = io('http://localhost:5000');

const Chat: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [question, setQuestion] = useState<{ questionText: string, answerOptions: string[] } | null>(null);
  const [waiting, setWaiting] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [winner, setWinner] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      socket.emit('user connected', { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    }

    socket.on('chat message', (data: { msg: string, user: { firstName: string, lastName: string } }) => {
      setMessages((prevMessages) => [...prevMessages, { msg: data.msg, type: 'chat', user: data.user }]);
    });

    socket.on('waiting', (msg: string) => {
      setWaiting(msg);
    });

    socket.on('start', () => {
      console.log('Game started');
      setWaiting(null);
      setGameActive(true);
      setWinner(null);
    });

    socket.on('question', (q: { questionText: string, answerOptions: string[] }) => {
      console.log('New question received:', q);
      setQuestion(q);
      setMessages((prevMessages) => [...prevMessages, { msg: q.questionText, type: 'question', user: null }]);
    });

    socket.on('showAnswers', (answers: { player: string, answer: string, isCorrect: boolean }[]) => {
      console.log('Answers received:', answers);
      answers.forEach(answer => {
        setMessages((prevMessages) => [...prevMessages, { msg: `${answer.player}: ${answer.answer}`, type: 'answer', user: null, isCorrect: answer.isCorrect }]);
      });
      setQuestion(null);
    });

    socket.on('end', (msg: string) => {
      console.log('Game ended:', msg);
      setMessages((prevMessages) => [...prevMessages, { msg, type: 'chat', user: null }]);
      setGameActive(false);

      const winnerMatch = msg.match(/Winner: (.*) with (\d+) points/);
      if (winnerMatch) {
        const newWinner = `${winnerMatch[1]} with ${winnerMatch[2]} points`;
        setWinner(newWinner);
      }

      setScores({});
      setQuestion(null);
    });

    socket.on('updateScores', (updatedScores: { [key: string]: number }) => {
      setScores(updatedScores);

      const highestScore = Math.max(...Object.values(updatedScores));
      const winningPlayer = Object.keys(updatedScores).find(player => updatedScores[player] === highestScore);

      if (winningPlayer) {
        const newWinner = `${winningPlayer} with ${highestScore} points`;
        setWinner(newWinner);
      }
    });

    socket.on('error', (error: string) => {
      alert(error);
    });

    return () => {
      socket.off('chat message');
      socket.off('waiting');
      socket.off('start');
      socket.off('question');
      socket.off('showAnswers');
      socket.off('end');
      socket.off('updateScores');
      socket.off('error');
    };
  }, [user]);



  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && user) {
      socket.emit('chat message', { msg: messageInput, user: { firstName: user.firstName, lastName: user.lastName } });
      setMessageInput('');
    }
  };

  const startGame = () => {
    if (user) {
      console.log('Starting game...');
      socket.emit('start game', { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    }
  };

  const answerQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && question) {
      console.log('Answering question:', messageInput);
      socket.emit('answer', { answer: messageInput });
      setMessageInput('');
    }
  };

  return (
    <div>
      {waiting && <p>{waiting}</p>}
      <ul id="messages">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`${message.type} ${message.type === 'answer' ? (message.isCorrect ? 'correct' : 'incorrect') : ''}`}
          >
            {message.user ? `${message.user.firstName} ${message.user.lastName}: ` : ''}{message.msg}
          </li>
        ))}
      </ul>
      {question && (
        <div className="question-container">
          <div className="answer-options">
            <ul>
              {question.answerOptions.map((option, index) => (
                <li key={index}>
                  <span className="label">{String.fromCharCode(65 + index)}</span> {/* A, B, C, D */}
                  {option}
                </li>
              ))}
            </ul>
          </div>
          <form id="form" onSubmit={answerQuestion}>
            <input
              id="input"
              autoComplete="off"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            
            <button><SendIcon/></button>
          </form>
        </div>
      )}
      {!question && gameActive && (
        <form id="form" onSubmit={sendMessage}>
          <input
            id="input"
            autoComplete="off"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
            <button><SendIcon/></button>
        </form>
      )}
      {!gameActive && (
          <Button variant="contained" onClick={startGame}>Start Game</Button>
      )}
      <div className="scores">
        {winner && <p className="winner">Winner: {winner}</p>}
        {Object.keys(scores).map((player) => (
          <p key={player}>{player}: {scores[player]}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
