const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';

// async and takes number of rounds to generate salt and callback function
// bcrypt.genSalt(10, (err, salt) => {
// // .hash() takes thing to hash, salt to use, and callback
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$iUzl8jOb/nkfo9a6kjPHQ.HYQh80iqH617AxA7Tm9zRV1H0Ubul1y';

// takes plain value, hased value and see if they match up
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})

//
// var data = {
//   id: 10
// };
//
// // takes the object and secret as parameters, signs it and return token
// var token = jwt.sign(data, 'secret');
// console.log(token);
// // takes a token and the secret and makes sure the data is not manipulated
// var decoded = jwt.verify(token, 'secrets');
// console.log(decoded);







// var message = "Enbani";
//
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
//
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed, do not trust');
// }
