// authenticate will find a user by token then alter the request to set the user and token

var {User} = require('./../models/user');


var authenticate = (req, res, next) => {
  // get token from request header
	var token = req.header('x-auth');

  // use custom static to find the user, then handle authentication
	User.findByToken(token).then((user) => {
		if (!user){
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next()
	}).catch((e) =>{
		res.status(401).send();
	})
};

module.exports = {authenticate};
