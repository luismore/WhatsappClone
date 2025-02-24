import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app);
const __dirname = process.cwd();
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    io.emit('user connected', 'Un nuevo usuario se ha conectado');
    
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('typing', (userName) => {
        socket.broadcast.emit('user typing', userName);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('user stopped typing');
    });
});

app.use(logger('dev'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});