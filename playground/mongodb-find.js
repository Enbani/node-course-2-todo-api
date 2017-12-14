// const MongoClient = require('mongodb').MongoClient;


// object destructuring var {variablename/key name} = object;
const {MongoClient, ObjectID} = require('mongodb');



// connects to client connect(url where database lives, callback function)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server.');
	}

	console.log('Connected to MongoDB server');

	// find returns a mongodb cursor
	// db.collection('Todos').find({
	// 	_id: new ObjectID('5a31caf5812581452f4c5405')
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos: ${count}`);
		
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	db.collection('Users').find({name: 'Sklyer'}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to find that person', err);
	})



	// db.close();
});