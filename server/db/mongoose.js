// connect to the database and configure mongoose

var mongoose = require('mongoose');

//tell mongoose to use promises
mongoose.Promise = global.Promise;

// make connection
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})

module.exports = {mongoose}
