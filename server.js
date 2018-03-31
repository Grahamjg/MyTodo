//var app = require('./todo');
var express = require('express');
var http = require('http');
var todo = express();

var server = http.createServer(todo);
//var io = require('socket.io')(server);

//io.sockets.on('connection', function(socket) {
//    console.log('A client is connected');
    //session.socket = socket;
    //mySocket = socket;
//    socket.on('joined', function (data) {
//        console.log(data);
        //socket.emit('messages', 'Hello from server')
//    });
//});
server.listen(process.env.PORT || 3000);
//server.listen(8080);
server.on('listening', function() {
  console.log('Server listening on http://localhost:%d', this.address().port);
});