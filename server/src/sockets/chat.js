const GameManager = require('./gameManager');

module.exports = (io) => {
  const gameManager = new GameManager(io);

  io.on('connection', (socket) => {
    console.log('a user connected');


    socket.on('user connected', (user) => {
      if (user) {
        socket.user = user;
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });

    socket.on('start game', () => {
      gameManager.addPlayer(socket);
    });

    socket.on('answer', ({ answer }) => {
      gameManager.handleAnswer(socket, answer);
    });
  });
};