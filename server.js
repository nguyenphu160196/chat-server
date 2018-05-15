const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const history = require('connect-history-api-fallback');
const mongoose = require('mongoose')
const router = express.Router();

const user = require('./routes/api/user');
const config = require('./config/config');

mongoose.connect(config.database);

const port = process.env.PORT || 9090;
var app = express();
var cors = require('cors');

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


app.get("/", (req, res) => {
  res.render('index');
})

app.use('/api/v1/', user);


app.listen(port, () => console.log('Server is running on port ' + port));