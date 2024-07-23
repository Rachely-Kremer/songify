const { generateArtistQuestion, generateAlbumQuestion } = require('./musicBrainzUtils');

const gameSessions = {};

const startGame = async (socket) => {
  const sessionId = generateUniqueSessionId(); // צור פונקציה לייצור מזהה ייחודי
  const triviaQuestion = Math.random() > 0.5
    ? await generateArtistQuestion()
    : await generateAlbumQuestion();
  
  gameSessions[sessionId] = {
    questions: [triviaQuestion],
    currentQuestionIndex: 0,
    players: [],
    manager: socket.id
  };
  
  console.log(`Starting game session ${sessionId} with question:`, triviaQuestion); // לוג
  
  socket.emit('game start', { sessionId, question: triviaQuestion });
  socket.broadcast.emit('game start', { sessionId });
};

const handleAnswer = (socket, answer, sessionId) => {
  const session = gameSessions[sessionId];
  if (session) {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (answer === currentQuestion.answer) {
      socket.emit('correct answer');
      socket.broadcast.emit('correct answer');
      
      session.currentQuestionIndex++;
      if (session.currentQuestionIndex < session.questions.length) {
        const nextQuestion = session.questions[session.currentQuestionIndex];
        socket.emit('next question', nextQuestion);
        socket.broadcast.emit('next question', nextQuestion);
      } else {
        socket.emit('game over');
        socket.broadcast.emit('game over');
      }
    } else {
      socket.emit('incorrect answer');
    }
  }
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('start game', () => startGame(socket));
    socket.on('submit answer', (answer, sessionId) => handleAnswer(socket, answer, sessionId));

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
