const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const history = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();

const sticky = require('sticky-session');
const cluster = require('cluster');

const user = require('./routes/api/user');
const room = require('./routes/api/room');
const chat = require('./routes/api/chat');

const userRT = require('./routes/realtime/user');
const roomRT = require('./routes/realtime/room');
const chatRT = require('./routes/realtime/chat');

const config = require('./config/config');

mongoose.connect(config.database);

const port = process.env.PORT || 9090;
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views','./dist');

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/dist')));

app.use(history({
    index: '/'
  }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// app.get("/", (req, res) => {
//   res.render('index');
// })

app.use('/api/v1/', [user, room, chat]);

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, config.secret, (err, decoded) => {
      if(err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
      next(new Error('Authentication error'));
  }    
})
.on('connection', userRT)
.on('connection', roomRT)
.on('connection', chatRT);

server.listen(port, () => console.log('Server is running on port ' + port));

// if(!sticky.listen(server,port))
// {
//   server.once('listening', function() {
//     console.log('Server started on port '+port);
//   });

//   if (cluster.isMaster) {
//     console.log('Master server started on port '+port);
//   } 
// }
// else {
//   console.log('- Child server started on port '+port+' case worker id='+cluster.worker.id);
// }