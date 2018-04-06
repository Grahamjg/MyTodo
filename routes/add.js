module.exports = function(app, settings){
	var url = require('url'),
        express = require('express');
    var bodyparser = require('body-parser');
    var tditem = require('../support/todo.js');

    var urlencodedParser = bodyparser.urlencoded({ extended: true });
// Adding an item to the to do list 
    app.post('/todo/add/', function(req, res) {
        if (req.body.newtodo != '') {
            if (req.session.isEdit) {
                req.session.todolist[req.session.recordindex] = 
                    new tditem (req.body.newtodo, req.body.completiondate, 
                        req.body.status);
            }
            else {
                //var td = new tditem (req.body.newtodo, req.body.completiondate, 
                //    req.body.status.selectedIndex);
                req.session.todolist.push(
                    new tditem (req.body.newtodo, req.body.completiondate, req.body.status));
            }
        }
        
        // set the index back once added
        req.session.recordindex = -1;
        req.session.isEdit = false;
        req.session.addtodo = new tditem('', '', '');
        res.redirect('/todo');
    })
};