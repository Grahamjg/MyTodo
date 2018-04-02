// Phase one: Get the basics working
// Using different set of controle more related to the property 
//   eg use a data time control for completion date
//      use a dropdown list equivalent for status
// Build the code into seperate files rather than one large one

var express = require('express');
var cookiesession = require('cookie-session');
var bodyparser = require('body-parser');

var todo = express();

var http = require('http');
var server = http.createServer(todo);
var io = require('socket.io')(server);
var urlencodedParser = bodyparser.urlencoded({ extended: true });
//var mySocket;

var tdo = function todoitem(description, completiondate, status){
    this.description = description;
    this.completiondate = completiondate;
    this.status = status;
};

var statusEnum = Object.freeze({"To Do":1, "In Progress":2, "Blocked":3, "Review":4, "Complete":5 })
var options = {
    host: 'localhost',
    port: 8080,
    path: '/todo'
};

tdo.prototype.desc = function(){
    return this.description;
};

//var html = '';
todo.use(cookiesession({
    name : 'todo',
    keys : ['todosecret'],
    maxAge : 20*60*1000}))
    
    
// If there is no to do list in the session, 
// create an empty array before continuing 
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }

    if (req.session.isEdit != 'undefined' &&  !req.session.isEdit ) {
        req.session.addtodo = new tdo('', '', '');
    }

    if (typeof(req.session.addtodo) == 'undefined') {
        req.session.addtodo = new tdo('', '', '');
        req.session.isEdit = false;
        req.session.recordindex = -1;
    }
    
    next();
})
.use(express.static(__dirname + '/public'))

// The to do list and the form are displayed 
.get('/todo', function(req, res) { 
    res.render('layout.ejs', {todolist: req.session.todolist
                              ,addtodo: req.session.addtodo
                              ,isedit: req.session.isEdit});
})

// Adding an item to the to do list 
.post('/todo/add/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        if (req.session.isEdit) {
            req.session.todolist[req.session.recordindex] = 
                new tdo (req.body.newtodo, req.body.completiondate, req.body.status);
        }
        else {
            var tditem = new tdo (req.body.newtodo, req.body.completiondate, req.body.status);
            console.log (tditem.description);
            req.session.todolist.push(
                new tdo (req.body.newtodo, req.body.completiondate, req.body.status));
        }
    }
    
    // set the index back once added
    req.session.recordindex = -1;
    req.session.isEdit = false;
    req.session.addtodo = new tdo('', '', '');
    res.redirect('/todo');
})

// Deletes an item from the to do list 
.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    req.session.isEdit = false;
    res.redirect('/todo');
})

.get('/todo/edit/:id',  function(req, res) {
    if (req.params.id != '') {
        // Store the current edited index
        // the req.param.id does not seem to have it when in add mode
        req.session.recordindex = req.params.id;
        var item = req.session.todolist[req.params.id];
        req.session.addtodo = item;
        req.session.isEdit = true;
        res.redirect('/todo',);
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

server.listen(8080);
