const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./src/routes/users');
const songsRouter = require('./src/routes/songs');
const playListsRouter = require('./src/routes/playLists');
const chatHandler = require('./src/sockets/chat');
const questionRouter = require('./src/routes/question');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/songs', express.static(path.join(__dirname, '..', 'client', 'songs')));
app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'assets'))); 

app.use('/api', usersRouter);
app.use('/api', songsRouter);
app.use('/api', playListsRouter);
app.use('/api', questionRouter);

const CONNECTION_URL = 'mongodb+srv://rachely-shulamit:HfaIUExXUCLK8qna@songify.1d3fhhe.mongodb.net/Songify?retryWrites=true&w=majority&appName=Songify';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

chatHandler(io);

module.exports = server;
