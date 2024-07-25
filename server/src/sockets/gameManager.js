const Question = require('../models/question');
const { options } = require('../routes/users');

class GameManager {
  constructor(io) {
    this.io = io;
    this.games = {};
    this.waitingPlayers = [];
  }

  addPlayer(socket) {
    const existingPlayer = this.waitingPlayers.find(player => player.user.email === socket.user.email);
    if (existingPlayer) {
      socket.emit('error', 'Player with this email is already in the waiting list.');
      return;
    }

    this.waitingPlayers.push(socket);

    if (this.waitingPlayers.length === 3) {
      const gameId = `game_${Date.now()}`;
      const players = this.waitingPlayers.splice(0, 3);
      this.games[gameId] = {
        players, answers: [], questionIndex: 0, questions: [],
        scores: players.reduce((acc, player) => {
          acc[player.user.email] = 0;
          return acc;
        }, {})
      };

      players.forEach(player => {
        player.emit('start');
        player.gameId = gameId;
      });

      this.askQuestions(gameId);
    } else {
      socket.emit('waiting', `Waiting for ${3 - this.waitingPlayers.length} more player(s)...`);
    }
  }

  async getQuestions() {
    try {
      const questions = await Question.find();
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  async askQuestions(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    const allQuestions = await this.getQuestions();
    if (allQuestions.length === 0) {
      this.io.emit('end', 'No questions available');
      return;
    }

    const selectedQuestions = [];
    for (let i = 0; i < 5; i++) {
      const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      selectedQuestions.push(randomQuestion);
    }
    game.questions = selectedQuestions;

    this.sendNextQuestion(gameId);
  }

  sendNextQuestion(gameId) {
    const game = this.games[gameId];
    if (!game || game.questionIndex >= game.questions.length) {
      console.log(`Game with gameId: ${gameId} has ended.`);
      return this.endGame(gameId);
    }

    const question = game.questions[game.questionIndex];
    game.players.forEach(player => {
      player.emit('question', {
        questionText: question.questionText,
        answerOptions: question.answerOptions
      });
    });

    setTimeout(() => {
      this.showAnswers(gameId);
      setTimeout(() => this.sendNextQuestion(gameId), 2000);
    }, 10000);
  }

  handleAnswer(socket, answer) {
    const gameId = socket.gameId;
    const game = this.games[gameId];
    if (!game) return;

    const question = game.questions[game.questionIndex];
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      game.scores[socket.user.email] = (game.scores[socket.user.email] || 0) + 1;
      console.log(`Player ${socket.user.email} answered correctly. New score: ${game.scores[socket.user.email]}`);
    }
    console.log(`Answer recorded for ${socket.user.email}: ${answer} (Correct: ${isCorrect})`);
    game.answers.push({ player: `${socket.user.firstName} ${socket.user.lastName}`, answer, isCorrect });
  }

  showAnswers(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    game.players.forEach(player => {
      player.emit('showAnswers', game.answers);
    });

    console.log('Answers shown:', game.answers);

    game.answers = [];
    game.questionIndex++;
  }

  endGame(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    const sortedScores = Object.entries(game.scores).sort(([, a], [, b]) => b - a);
    const winner = sortedScores[0];

    console.log(`Ending game with gameId: ${gameId}`);
    console.log(`Scores: ${JSON.stringify(game.scores)}`);
    console.log(`Winner: ${winner[0]} with ${winner[1]} points`);

    game.players.forEach(player => {
      player.emit('end', `Game Over. Winner: ${winner[0]} with ${winner[1]} points`);
    });

    this.games[gameId].players = [];
    this.games[gameId].scores = {};
    this.games[gameId].questionIndex = 0;
    delete this.games[gameId];
  }

}

module.exports = GameManager;
