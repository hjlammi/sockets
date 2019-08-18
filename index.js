const io = require('socket.io')().listen(8000);

io.on('connection', (socket) => {
  console.log('Connected.');
});
