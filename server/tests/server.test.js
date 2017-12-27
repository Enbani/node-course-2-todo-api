const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [{
	text: 'Learn Mandarin',
	_id: new ObjectID()
}, {
	text: 'Become a master audiophile',
	_id: new ObjectID()
}]


beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
})

// use describe to group all the routes
describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		// verify length of text is 0
		// expect 400


		// supertest simulates a request
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});
});


describe('GET /todos', () => {
	it('Should get all todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
})

// use done() as a parameter in tests that are async
describe('GET /todos/:id',() =>{
	it('should return the todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				console.log(res.body);
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	})

	it('should return 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();
		//make sure to get a 404 back

		request(app)
			.get(`/todos/${id}`)
			.expect(404)
			.end(done);
	});


	it('should return a 404 for non-object ids', (done) => {
    // todos/123
		request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
	})
})


describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();


		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});
  //
	it('should return 404 if objectID is invalid', (done) => {
		request(app)
			.delete(`/todos/1234`)
			.expect(404)
			.end(done);
	});
})
