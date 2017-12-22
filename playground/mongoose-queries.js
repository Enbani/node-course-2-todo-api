const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var userID = '5a39deb2ddb8e273c68a8864';

User.findById(userID).then((user) => {
	if (!user) {
		return console.log('User not found.');
	}

	console.log(`User ${userID} found \n`, JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));



// var id = '5a3c6a554e5f9b3ba7a35ffc11';





// if (!ObjectID.isValid(id)) {
// 	console.log(`ID: ${id} is not valid`)
// };
// Todo.find({
// 	_id: id,
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id,
// }).then((todo) => {
// 	console.log('Todos', todo);
// });

// Todo.findById(id).then((todo) => {

// 	if (!todo){
// 		return console.log('ID not found');
// 	}

// 	console.log('Todo by ID', todo);
// }).catch((e) => {
// 	console.log(e);
// })

