const express = require('express');
const http = require('http');
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);

// https://github.com/xpepermint/socket.io-express-session/blob/master/index.js
function ios(session) {
  return function(socket, next) {
    session(socket.handshake, {}, next);
  };
}

var session = Session({
  store: new SessionStore({path: __dirname+'/tmp/sessions'}),
  secret: 'pass',
  resave: true,
  saveUninitialized: true
});

const app = express();
app.use(session);

app.get('/user', function (req, res) {
  // TODO
});

app.get('/login', function (req, res) {
  // req.session.loggedInUser = 'jani-petteri';

  req.session.loginAttempts++;

  if (authenticate(req.body.username, req.body.password)) {
    req.session.loggedInUser = req.body.username;
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

const server = http.createServer(app);
const io = require('socket.io')(server);
server.listen(8000);

io.use(ios(session));

io.on('connection', (socket) => {
  if (!socket.handshake.session.loggedInUser) {
    console.log('Websocket connection from an unauthenticated user!');
    return;
  }

  console.log('New websocket connection from ' + socket.handshake.session.loggedInUser);

  // socket.handshake.session.pieru = 'jee';
  socket.handshake.session.save();
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
