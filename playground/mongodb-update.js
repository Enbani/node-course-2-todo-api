// const MongoClient = require('mongodb').MongoClient;


// object destructuring var {variablename/key name} = object;
const {MongoClient, ObjectID} = require('mongodb');



// connects to client connect(url where database lives, callback function)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server.');
	}

	console.log('Connected to MongoDB server');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID("5a359ca723ca3209876bba29")
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}			

	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5a31d68b23ca3209876b8d67')
	}, {
		$set: {
			name: "Skyler"
		},
		$inc: {
			age: 1
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	})
	// db.close();
});