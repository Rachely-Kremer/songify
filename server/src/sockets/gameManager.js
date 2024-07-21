class GameManager {
  constructor(io) {
    this.io = io;
    this.games = {};
    this.waitingPlayers = [];
  }

  addPlayer(socket) {
    this.waitingPlayers.push(socket);

    if (this.waitingPlayers.length === 3) {
      const gameId = `game_${Date.now()}`;
      const players = this.waitingPlayers.splice(0, 3);
      this.games[gameId] = { players, answers: [], questionIndex: 0 };

      players.forEach(player => {
        player.emit('start');
        player.gameId = gameId;  // Add gameId to player socket
      });

      this.askQuestion(gameId);
    } else {
      socket.emit('waiting', `Waiting for ${3 - this.waitingPlayers.length} more player(s)...`);
    }
  }

  askQuestion(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    const question = this.getQuestion(game.questionIndex);
    game.players.forEach(player => {
      player.emit('question', question);
    });

    setTimeout(() => {
      this.showAnswers(gameId);
    }, 10000);
  }

  handleAnswer(socket, answer) {
    const gameId = socket.gameId;
    const game = this.games[gameId];
    if (!game) return;

    game.answers.push({ player: socket.id, answer });
  }

  showAnswers(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    this.io.emit('showAnswers', game.answers);

    // Reset answers and move to next question
    game.answers = [];
    game.questionIndex += 1;
    if (game.questionIndex < this.getQuestionsCount()) {
      this.askQuestion(gameId);
    } else {
      this.endGame(gameId);
    }
  }

  endGame(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    this.io.emit('end', 'Game Over');
    delete this.games[gameId];
  }

  getQuestion(index) {
    const questions = [
      {
        question: 'When was song X released?',
        options: ['1990', '2000', '2010']
      },
      {
        question: 'Who released song Y?',
        options: ['Artist A', 'Artist B', 'Artist C']
      }
      // Add more questions as needed
    ];

    return questions[index % questions.length];
  }

  getQuestionsCount() {
    return 2; // Change this to the actual number of questions
  }
}

module.exports = GameManager;
