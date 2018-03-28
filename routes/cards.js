const express = require('express');
const router = express.Router();
// the following is ES6 syntax for: const data = require('../data/flashcardData.json').data; and const cards = data.cards;
// you can include json directly into node - it reads the text file and then parses the text converting it into a json object (so we don't have to call json.parse())
// grab json string 'data'
const { data } = require('../data/flashcardData.json');
// grab the cards array from json string
const { cards } = data;   


// Cards route
// because we're directly traffic from the /cards path in the app.js file, every route in this file will start with cards
// so we can just cut out cards for now and instead use just '/'
// we can now set up a parameter route:
//	1. place colon after the slash (tells express that this part of the url is a variable)
//	2. set up id a variable or route parameter named id
//	3. then we use the id property on the params on the request object because that is what we called it in the url above
router.get('/:id', (req, res) => { 
	// check for presence of a query string on the request object, then grab it
	// ES6 shorthad for req.query.side;
	// depending on what we type in the browswer (?side=answer, ?side=question), this will grab the value (answer/question)
	// grab side from the user inputted query string
	const { side } = req.query;
	// grab the cards id (id meaning it's array id in the json string)
	// grab the id ( cards/***number*** )
	const  id  = parseInt(req.params.id);

	// make sure that a side has been specified in query string & and add question side as default if not
	// add return statement to exit code following this block & avoid errors ( can redirect & render)
	if (!side) {
		return res.redirect(`/cards/${id}?side=question`);
	}

	// now we can access the two peices of text that we want to use ( side or id ) and grab either question or answer from the json
	const text = cards[id][side];
	// grab the cards hint   
	const { hint } = cards[id];
 	
 	const name = req.cookies.username;
	// shorthand for {text: text}
	// set up the templateData object to inject into the page later
	const templateData = {id, text, name};

	// create variable to use to tell pug to not render next button/previous button
	if (id != cards.length-1) {
		templateData.next = true;
	}
	if (id != 0) {
		templateData.previous = true;
	}

	// add the hint to the template only if the question side is showing
	if (side === 'question') {
		templateData.hint = hint;
		// add the sideToShow property to templateData (since we're on the question, we want to point to the answer)
		templateData.sideToShow = 'answer';
		// add the sideToShowDisplay property to templateData
		templateData.sideToShowDisplay = 'Answer';
	} else if (side === 'answer') {
		// add the sideToShow property to templateData (since we're on the question, we want to point to the answer)
		templateData.sideToShow = 'question';
		// add the sideToShowDisplay property to templateDataf
		templateData.sideToShowDisplay = 'Question';
	}

	res.render('card', templateData);

});

router.get('/', (req, res) => {
	const numberOfCards = cards.length;
	const flashCardId = Math.floor( Math.random() * numberOfCards );
	res.redirect(`/cards/${flashCardId}?side=question`);
});


// export our router
module.exports = router;


















