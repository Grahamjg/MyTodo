// Divide all of your modules in different files and
// require them here
module.exports = function(app, settings){
	require('./main')(app, settings);
	require('./add')(app, settings);
	require('./edit')(app, settings);
	require('./delete')(app, settings);
};