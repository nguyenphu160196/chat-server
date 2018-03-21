const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const history = require('connect-history-api-fallback');
const mongoose = require('mongoose')

const index =  require('./routes/index');
const user = require('./routes/api/user');

const config = require('./config/database');
mongoose.connect(config.database);

const port = process.env.PORT || 9090;
var app = express();
var cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

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

app.use('/', index);
app.use('/api/', user);


app.listen(port, () => console.log('Server is running on port ' + port));