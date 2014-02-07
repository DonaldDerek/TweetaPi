
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var sys = require('sys');
var exec = require('child_process').exec;
var child;

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routing
app.get('/', function (req, res) {
  res.render('index', { title: 'PiCam' });
});

//Socket Events
io.sockets.on('connection', function (socket) {
  socket.on('shoot', function (data) {
    var timestamp = Number(new Date()); 	
  	console.log(data)
  	child = exec("raspistill -o "+timestamp+".jpg", function (error, stdout, stderr) {
  		socket.emit('preview', { name: timestamp+'.jpg' });
  	});
  });
});

server.listen(app.get('port'), function(){
  console.log('Express and Socket.io server listening on port ' + app.get('port'));
});
