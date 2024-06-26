module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');


        socket.on('send-message', (message) => {
            console.log(`Message from client: ${JSON.stringify(message)}`);
            io.emit('message', 'Hello from server');
        });
        socket.on('disconnected', () => {
            console.log('Client disconnected');
        });
    });
};