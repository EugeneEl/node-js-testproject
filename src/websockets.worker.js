const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const port = 8001;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const activeUsers = {};

app.post('/notify', (req, res) => {
  const { userId, text = '' } = req.body;

  console.log(userId);
  console.log(activeUsers[userId]);
  
  if (!userId || !activeUsers[userId]) {
    res.send('no user active id or userId is missed');
  } else {
    const { socketId } = activeUsers[userId];

    console.log('send to socket');
    console.log(socketId);

    io.to(`${socketId}`).emit('notify', text);

    res.send('success send event via sockets');
  }
});

console.log('start');

io.on('connection', (socket) => {
  const _userId = socket.handshake.query.userId;

  if (_userId) {
    activeUsers[_userId] = {
      userId: _userId,
      socketId: socket.id,
    };
    console.log(`added user with id:${_userId}`);
  } else {
    socket.emit('error', 'userId not sent');
  }

  socket.on('error', (error) => {
    console.log(`socket error: ${error}`);
  });

  socket.on('disconnect', () => {});
});

server.listen(port, () => console.log(`WS running at :${port} port`));
