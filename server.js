var express = require('express'),
rootDir = __dirname,
config = require('./config');
var cookiesession = require('cookie-session');
var bodyparser = require('body-parser');
var http = require('http');

var todo = express();
var settings = {
	config: config
};

var urlencodedParser = bodyparser.urlencoded({ extended: true }); 

todo.set('port', config.PORT || process.env.port || 3000)
.use(cookiesession({
  name : 'todo',
  keys : [config.SESSION_SECRET],
  maxAge : config.maxAge}))


.use(express.static(__dirname + '/public'))
.use(urlencodedParser);

//This allows you to require files relative to the root
requireFromRoot = (function(root) {
  return function(resource) {
      return require(root + "/" + resource);
  }
})(__dirname);
routes = require('./routes')(todo, settings);

var io = require('socket.io')
  .listen(http.createServer(todo)
    .listen(todo.get('port'), function(){
      console.log('Express server listening on port ' + todo.get('port'));
}));

io.sockets.on('connection', function(socket) {
  console.log('A client is connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('joined', function (data) {
      console.log(data);
      //socket.emit('messages', 'Hello from server')
  });
});


