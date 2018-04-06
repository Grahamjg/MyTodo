module.exports = function(app, settings){
	var url = require('url'),
		express = require('express'),
        rootRouter = express.Router();
        var tditem = require('../support/todo.js');


        var statusEnum = Object.freeze({"To Do":1, "In Progress":2, "Blocked":3, "Review":4, "Complete":5 })
        
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
    .get('/todo', function(req, res) { 
        res.render('layout.ejs', {todolist: req.session.todolist
                                  ,addtodo: req.session.addtodo
                                  ,isedit: req.session.isEdit
                                  ,portNr : app.get('port')
                                  ,statusVal: statusEnum});
    })
};