// in order to use express, we must add it using node's require statement
//		1. the module is called 'express'
//		2. this is the parameter that is passed into the require function
//		3. we can assign this to avariable and the name express is an ideal name for the variable
//		4. now we can use the variable 'express' to access all of the methods or properties of the express module
const express = require('express');
// require body-parser
const bodyParser = require('body-parser');
// require cookie-parser
const cookieParser = require('cookie-parser');

// the express function returns an express application
// we assign it to variable app (that is standard convention)
// this app is central part of application
// we will extend it (add routes, middleware, other settings, etc)
const app = express();
// add body-parser to app
app.use(bodyParser.urlencoded({ extended: false }));
// add cookie-parser to app
app.use(cookieParser());

// use middleware to handle static files contained in the public folder
// we can optionally route this folder to a specific location (default is at root) (we'll route to '/static') ***type localhost:3000/static/stylesheets/style.css***
app.use('/static', express.static('public'));


// set the view engine to the parameter 'pug'
// the .set() method defines different settings in express
//		1. 'pug' just tells express which template engine to use (by default express will look at a folder called views by default)
//			*** if you want to change views or nest it -- you'll need to define the views setting to have express point to the correct place
app.set('view engine', 'pug');

// require the routes file and cards file
// *** PLEASE NOTE THAT ('./routes') is only shorthand for ('./routes/index.js') we can do this because the routes file is named index.js
const mainRoutes = require('./routes');
const cardRoutes = require('./routes/cards');

// we can use the routes variable we declared to now make middleware
app.use(mainRoutes);
// set up cards routes
app.use('/cards', cardRoutes);

/* =========================================================================
						CREATE SOME MIDDLEWARE

				1. use app.use()
				2. pass in middleware as an anonymous function
				3. next passes control forward through the app. it's like the next step on the conveyor belt
				4. you can pass as much middleware to each app.use() as you want
				5. middleware always executes in the order that it is in the code (even if there are multiple anonymous
				   functions in one app.use(), they will execute in order before going to the next instance of app.use())
				6. you can use middleware to create properties on the request/response objects. (ie req.message creates the message
				   property on the request object. you can then retreive that propterty's value or set it's value later on)
				7. next() signals the end of middleware fucntions - call next() at the end of a middleware function
				8. express relies on the next() function to know when to move forward - if next() is absent, it waits
				   indefinitely for next() to be called
				9. alternatively, middleware can be ended with a response. (ie res.render, res.json, etc.)

========================================================================= */

// create and set a message property on the request (message is arbitrary - we could name it anything we like)
app.use( (req, res, next) => {
	req.message = 'Hey there second middleware!'
	// create new error instance (Error is a native js function)
	const err = new Error('Oh no!');
	// set error status code
	err.status = 500;
	next();
});
// access the message property on the response object and log it to the console
app.use( (req, res, next) => {
	console.log(req.message);
	next();
});



// handle 404 errors
app.use((req, res, next) => {
	// create new error
	const err = new Error('Not Found');
	// set status code for page you can't find
	err.status = 404;
	// pass error into the next() function
	next(err);
});


// create custom error middleware
app.use( (err, req, res, next) => {
	// set locals/set error (err) property on res.locals.error
	res.locals.error = err;
	// status sets the error of the code (500 is a general error that means the server hasn't responded as expected)
	res.status(err.status);
	// render the error template and give it access to the error (err) data
	res.render('error', err);
});

// this allows us to use the app through a browser by going to localhost:{portname}   (portname = 3000)
// it tells the server which port to route the server on
// add a callback that adds message to terminal that lets you know what is going on
const port = 3000;
app.listen(port, () => {
	console.log(`The application is running on localhost:${port}`);
});
