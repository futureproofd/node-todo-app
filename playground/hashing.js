/* eslint-disable no-console */
const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// user pw
const password = '123abc!';

// result of hash+salt
const hashedPassword =  '$2a$10$d713fYMyGUPZfC0N.CeZQe9fwm67MH2Cm3.RGBHkKfFy8GGFeMqRW';

// generate a salted, hashed pw
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

// compare a users plaintext input to our hashed DB value
bcrypt.compare(password, hashedPassword, (err, res) => {
  if (res) {
    // match
    console.log(res);
  } else {
    console.log(err);
  }
});

// conceptual userID
const data = {
  id: 10,
};

// sign our data with a secret pw
const token = jwt.sign(data, 'abc123');
console.log(token);

const decoded = jwt.decode(token);
console.log('decoded:', decoded);

const msg = 'test';
const hash = SHA256(msg).toString();

console.log(hash);
