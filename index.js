const io = require('socket.io')().listen(8000);

io.on('connection', (socket) => {
  socket.on('login', (credentials) => {
    console.log('Login event was sent.');
    if (credentials.username === 'joo' && credentials.password === 'jaa') {
      console.log('Login success.');
      socket.emit('loginSuccess');
    } else {
      console.log('Login failure.');
      socket.emit('loginFailure');
    }
  });
});
