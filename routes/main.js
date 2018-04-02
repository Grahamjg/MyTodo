module.exports = function(app, settings){
	var url = require('url'),
		express = require('express'),
        rootRouter = express.Router();
        var tditem = require('../support/todo.js');
        
	// Any generic logic can go here
	rootRouter.use(function(req, res, next) {
        if (typeof(req.session.todolist) == 'undefined') {
            req.session.todolist = [];
        }
    
        if (req.session.isEdit != 'undefined' &&  !req.session.isEdit ) {
            req.session.addtodo = new tditem('', '', '');
        }
    
        if (typeof(req.session.addtodo) == 'undefined') {
            req.session.addtodo = new tditem('', '', '');
            req.session.isEdit = false;
            req.session.recordindex = -1;
        }
		next();
	});

    app.use(rootRouter)
    // If there is no to do list in the session, 
    // create an empty array before continuing 
    /*app.use(function(req, res, next){
        if (typeof(req.session.todolist) == 'undefined') {
            req.session.todolist = [];
            console.log("Set array")
        }
    
        if (req.session.isEdit != 'undefined' &&  !req.session.isEdit ) {
            req.session.addtodo = new tditem('aaaa', '02/04/2018', '4');
            console.log("Set add")
        }
    
        if (typeof(req.session.addtodo) == 'undefined') {
            req.session.addtodo = new tditem('bbb', '02/04/2018', '3');
            req.session.isEdit = false;
            req.session.recordindex = -1;
        }
        
        next();
    })*/
    .get('/todo', function(req, res) { 
        res.render('layout.ejs', {todolist: req.session.todolist
                                  ,addtodo: req.session.addtodo
                                  ,isedit: req.session.isEdit});
    })
};