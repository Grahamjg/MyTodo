module.exports = function(app, settings){
	var url = require('url'),
        express = require('express');


    // Edit an item - display it in the controls
    app.get('/todo/edit/:id',  function(req, res) {
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
};