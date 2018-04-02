module.exports = function(app, settings){
	var url = require('url'),
        express = require('express');

    // Deletes an item from the to do list 
    app.get('/todo/delete/:id', function(req, res) {
        if (req.params.id != '') {
            req.session.todolist.splice(req.params.id, 1);
        }
        req.session.isEdit = false;
        res.redirect('/todo');
    })
};