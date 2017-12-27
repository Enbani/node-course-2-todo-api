const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove() - remove will remove anything matching a key
// Todo.remove({}) - will remove everything from the collection

// Todo.remove({}).then((result) => {
// 	console.log(result);
// })

// Todo.findOneAndRemove({})
// Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5a43328ef375550a9d13e01c').then((todo) => {
	console.log(todo);
})
