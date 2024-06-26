const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');


const usersRouter = require('./src/routes/users');
const songsRouter = require('./src/routes/songs');
const playListsRouter = require('./src/routes/playLists');
const chatHandler = require('./src/sockets/chat');




const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});


app.use('/api', usersRouter);
app.use('/api', songsRouter);
app.use('/api', playListsRouter);



const CONECTION_URL = 'mongodb+srv://rachely-shulamit:HfaIUExXUCLK8qna@songify.1d3fhhe.mongodb.net/Songify?retryWrites=true&w=majority&appName=Songify';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => server.listen(PORT, () => console.log(`server runing on port ${PORT}`)))
    .catch((error) => console.log(error.message));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


chatHandler(io);
