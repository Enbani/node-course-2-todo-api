// const MongoClient = require('mongodb').MongoClient;


// object destructuring var {variablename/key name} = object;
const {MongoClient, ObjectID} = require('mongodb');


// connects to client connect(url where database lives, callback function)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server.');
	}

	console.log('Connected to MongoDB server');

	// // takes string name of collection
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: 'false'

	// }, (err, results) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	};

	// 	console.log(JSON.stringify(results.ops, undefined, 2));

	// });

	// db.collection('Users').insertOne({
	// 	name: 'Sklyer',
	// 	age: 28,
	// 	location: 'New York'
	// }, (err, results) => {
	// 	if (err) {
	// 		return console.log('Unable to insert Users', err);
	// 	};

	// 	console.log(JSON.stringify(results.ops[0]._id.getTimestamp(), undefined, 2));

	// })

	db.close();
});