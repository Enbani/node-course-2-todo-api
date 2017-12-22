// server.js will only be responsible for routes

// library imports
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); // ObjectID pulled from mongodb

// local imports
// object destructuring ES6 syntax
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// store express application
var app = express();

// configure middleware
// app.use() takes middleware. 
	// function if custom middleware.
	// something off of the library if third party
app.use(bodyParser.json());


// configure routes


// make a post request to todos
// create a new todo, save and send in response
// make a post request to the todos endpoint
app.post('/todos', (req, res) => {
	console.log(req.body);

	var todo = new Todo({
		text: req.body.text,
		completed: req.body.completed
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});


app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});


});

// GET /todos/{id}

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	//isValid() is a method of ObjID 
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			 res.status(404).send();
		}

		res.send(todo);
	}).catch((e) => {
		res.status(400).send();
	});

});

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports ={app};
