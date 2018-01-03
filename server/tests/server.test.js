const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const{todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

// use describe to group all the routes
describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
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
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(1);
		})
		.end(done);
	});
})

// use done() as a parameter in tests that are async
describe('GET /todos/:id',() =>{
	it('should return the todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				console.log(res.body);
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	})


	it('should not return the todo doc created by other user', (done) => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	})

	it('should return 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();
		//make sure to get a 404 back

		request(app)
			.get(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});


	it('should return a 404 for non-object ids', (done) => {
    // todos/123
		request(app)
			.get(`/todos/123`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	})
})


describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();


		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
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


	it('should not remove a todo', (done) => {
		var hexId = todos[0]._id.toHexString();


		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toExist();
					done();
				}).catch((e) => done(e));
			});
	});


	it('should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
  //
	it('should return 404 if objectID is invalid', (done) => {
		request(app)
			.delete(`/todos/1234`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
})



describe('/PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
    // grab id of first value
    // make the patch request
    // update text and set completed = true
    // 200
    // text is changed, completed is true, completedAt is a number

		var hexId = todos[1]._id.toHexString();
		var update = {
			text: "This is an update for the test case",
			completed: true
		};

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send(update)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(update.text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('should not update the todo', (done) => {
		var hexId = todos[1]._id.toHexString();
		var update = {
			text: "This is an update for the test case",
			completed: true
		};

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.send(update)
			.expect(404)
			.end(done);
	});
	it('should clear completedAt when todo is not completed', (done) => {
  //   // grab id of second todo item
  //   // update text, set completed to false
  //   // 200
  //   // text is changed, completed false, completedAt is null .toNotExist

		var hexId = todos[0]._id.toHexString();
		var update = {
			text: "This will not be completed",
			completed: false
		}

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.send(update)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(update.text);
			})
			.expect((res) => {
				expect(res.body.todo.completed).toBe(false);
			})
			.expect((res) => {
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);

	});

})


describe('GET /users/me', () => {
	it('should return a user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done)
	});

	it('Should return a 401 when not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done)
	});
})


describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'example@example.com';
		var password = 'password';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({email}).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((e) => done(e));
			})
	});


	it('should return validation errors if request invalid', (done) => {
    // send invalid email and password expect 400
		var email = 'invalid';
		var password = '';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});


	it('should not create user if email in use', (done) => {
    // should fail when trying a user that exists with vaild password
    // expect 400

		request(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: users[0].password
			})
			.expect(400)
			.end(done);
	});


})




describe('POST /users/login', () => {
	it('should log in user and return auth token', (done) =>{
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res)=> {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e));
			})
	})

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'invalid'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((e) => done(e));
			})
	})
})



describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
    // make a delete request
		// set x-auth equal to tokens
    // 200
    // find user and verify tokens array has length 0
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	})
})
