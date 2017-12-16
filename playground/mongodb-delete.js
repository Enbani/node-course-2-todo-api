// const MongoClient = require('mongodb').MongoClient;


// object destructuring var {variablename/key name} = object;
const {MongoClient, ObjectID} = require('mongodb');



// connects to client connect(url where database lives, callback function)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server.');
	}

	console.log('Connected to MongoDB server');

	// deleteMany

	// db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
	// 	console.log(result);
	// })

	// deleteOne
	// db.collection('Todos').deleteOne({text: "Eat lunch"}).then((result) => {
	// 	console.log(result);
	// })


	// findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// })

	// db.collection('Users').deleteMany({name: 'Sklyer'}).then((result) => {
	// 	console.log(result);
	// })

	db.collection('Users').findOneAndDelete({
		_id: new ObjectID("5a31d70d23ca3209876b8d99")}).then((result) => {
			console.log(JSON.stringify(result, undefined, 2));
		}
	)

	// db.close();
});