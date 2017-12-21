// require mongoose and create a model for the User collection

var mongoose = require('mongoose');

var User = mongoose.model('User', { 
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
});


// export to be used in server.js
module.exports = {User};