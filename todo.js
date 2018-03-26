var express = require('express');
var cookiesession = require('cookie-session');
var bodyparser = require('body-parser');

var todo = express();

//var jsdom = require("jsdom");
//var window = jsdom.window;
// window.$ = require('jquery')(window);
//require("jsdom").env("", function(err, window) {
//    if (err) {
//        console.error(err);
//      return;
//   }
 //
 //   var $ = require("jquery")(window);
//});

//var $ = require('jquery');
//var $ = require('jquery')(require("jsdom").parentWindow);
//var jsdom = require("jsdom"); 
//$ = require("jquery"); 
//window.$ = require('jquery')(window);
//var jsdom = require('jsdom')
//  , myWindow = jsdom.createWindow
  
//  ;
//var aWindow = $.createWindow;
//var $ = require('jQuery').createWindow

var http = require('http');
var server = http.createServer(todo);
var io = require('socket.io')(server);
var urlencodedParser = bodyparser.urlencoded({ extended: true });
var mySocket;

var tdo = function todoitem(description, completiondate, status){
    this.description = description;
    this.completiondate = completiondate;
    this.status = status;
};

var options = {
    host: 'localhost',
    port: 8080,
    path: '/todo'
};

tdo.prototype.desc = function(){
    return this.description;
};

var html = '';
todo.use(cookiesession({
    name : 'todo',
    keys : ['todosecret'],
    maxAge : 20*60*1000}))
    
    
/* If there is no to do list in the session, 
create an empty array before continuing */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
    
})
.use(express.static(__dirname + '/public'))

/* The to do list and the form are displayed */
.get('/todo', function(req, res) { 
    //req.session.todolist.push(new tdo('aaa1', 'fff', '0'));
    res.render('layout.ejs', {todolist: req.session.todolist});
})

/* Adding an item to the to do list */
.post('/todo/add/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
 
        req.session.todolist.push(
            new tdo (req.body.newtodo, req.body.completiondate, req.body.status));
    }
    res.redirect('/todo');
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

.get('/todo/edit/:id',  function(req, res) {

    if (req.params.id != '') {
        var item = req.session.todolist.slice(req.params.id, 1);
        //$("#newtodo").val("hello");
        //mySocket.emit('edit', item);
        mySocket.emit('messages', 'Hello from server')
 
    }
 
})

io.sockets.on('connection', function(socket) {
    console.log('A client is connected');
    //session.socket = socket;
    mySocket = socket;
    socket.on('joined', function (data) {
        console.log(data);
        //socket.emit('messages', 'Hello from server')
    });
    
});

todo.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page cannot be found!');
});

//todo.listen(8080);
server.listen(8080);