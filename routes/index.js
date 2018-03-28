const express = require('express');
const router = express.Router();

/* =========================================================================
									ROUTES

		 CREATE A ROUTE (this will be the route to the home route (aka root route))
			1. use the get method on the app object
			2. to indicate the sites route route (home route) you must use a forward slash as first parameter (location parameter)
			3. next, we need a callback function with two parameters (request and respond) *** This callback will run when a client requests this route
			4. req = request, res = response
========================================================================= */

// Home route
router.get('/', (req, res) => {
	//store username from the cookie
	// we can access the cookies because we have cookie-parser installed and required
	const name = req.cookies.username;
	if (name) {
		// use the render method to render the index.pug page
		// file extension not necessary since view engine has already been set to pug (express knows to look in the views folder for files with .pug extension)
		// { name } is shorthand for { name: name }
		res.render('index', { name });
	} else {
		res.redirect('/hello');
	}
});


// Hello get route
router.get('/hello', (req, res) =>{
	const name = req.cookies.username;
	if (name) {
		res.redirect('/')
	} else {
		res.render('hello');
	}
});

// Hello post route
router.post('/hello', (req, res) =>{
	// this sends a cookie to the browser after we submit the form (aka express set's a cookie on the client)
	res.cookie('username', req.body.username)
	// the body property of req contains form data but only after we install body-parser
	res.redirect('/');
});

// Goodbye route
router.post('/goodbye', (req, res) => {
	res.clearCookie('username');
	res.redirect('/hello');
});

// Test route (to demonstrate how the send method works)
router.get('/test', (req, res) => {
	res.send('<h2>The send method!</h2><br><input type="text" placeholder="This is a placeholder" ><br><button>Click Here!</button>')
});



// export the routes
module.exports = router;
