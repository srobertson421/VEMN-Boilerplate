require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET || 'supersecretcode';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dumbdeveloperblog');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ message: 'You need an authorization token to view this information.' });
  }
});

// Check for dev environment and switch to webpack hot-reload
if(process.env.NODE_ENV === 'development') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {colors: true}
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));
} else {
  app.use(express.static(__dirname + '/public'));
}

app.use('/api/auth', require('./controllers/auth-controller'));
app.use('/api/posts', expressJWT({secret: secret}).unless({path: ['/api/posts', '/api/posts/:id'], method: 'GET'}), require('./controllers/posts-controller'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000);
