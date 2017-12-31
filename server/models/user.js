// require mongoose and create a model for the User collection

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// Schema lets you define new schema in order to add custom methods
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate:{
			isAsync: false,
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			require: true
		},
		token: {
			type: String,
			require: true
		}

	}]

});

// create instance methods, these get called with the document as the binding
UserSchema.methods.toJSON = function () {
  //determines what gets sent back in response when model is converted to json value
  // automatically called when we respond to express request with res.send
  // res.send calls JSON.stringify, which calls toJSON. toJSON customizes JSON.stringify behavior
  // more info: https://stackoverflow.com/questions/20734894/difference-between-tojson-and-json-stringify


	var user = this;
	var userObject = user.toObject()

	return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  // create access value and token


	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString();


  // create new array and set values as specified above
	user.tokens = user.tokens.concat([{access, token}]);

  // return a promise with the token that can be used in server.js
	return user.save().then(() => {
		return token;
	});
};

// like methods, but turns into model opposed to instance method
// these get called with the model as the binding
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'secret');
    // this will decode the token, which contains the object it was created with
	} catch (e) {
		return new Promise((resolve, reject) => {
			return reject();
		})
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.access': 'auth',
		'tokens.token': token
	})
}


UserSchema.statics.findByCredentials = function (email, password) {
 	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return bcrypt.compare(password, user.password).then((res) => {
			if (res) {
				return user;
			} else {
				return Promise.reject();
			}
		});
	});
}

//mongoose middleware: before the specified event "save", run this function
// function called with next in order to allow middleware to complete

// this will help store an encrypted hash for the user password
UserSchema.pre('save', function(next) {
	var user = this;

	if (user.isModified('password')) {
    // hash password and set it to the password
		bcrypt.genSalt(10, (err, salt) => {
			var hash = bcrypt.hash(user.password, salt, (err, hash) => {
			user.password = hash;
			next();
			})
		})
	} else {
		next();
	}
})
var User = mongoose.model('User', UserSchema);


// export to be used in server.js
module.exports = {User};
