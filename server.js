

var express = require('express'),
rootDir = __dirname,
config = require('./config');
var cookiesession = require('cookie-session');
var bodyparser = require('body-parser');
var http = require('http');

// not using this yet
var io = require('socket.io')(server);

var todo = express();
var server = http.createServer(todo);

var settings = {
	config: config
};

var urlencodedParser = bodyparser.urlencoded({ extended: true }); 

todo.set('port', config.PORT || process.env.port || 3000)
 .use(cookiesession({
    name : 'todo',
    keys : ['todosecret'],
    maxAge : 20*60*1000}))

.use(express.static(__dirname + '/public'))
.use(urlencodedParser);

//This allows you to require files relative to the root
requireFromRoot = (function(root) {
  return function(resource) {
      return require(root + "/" + resource);
  }
})(__dirname);
routes = require('./routes')(todo, settings);

http.createServer(todo).listen(todo.get('port'), function(){
  console.log('Express server listening on port ' + todo.get('port'));
});


