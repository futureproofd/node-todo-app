/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: value => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Middleware hook
userSchema.pre('save', function (next) {
  user = this;
  if (user.isModified('password')) {
    // generate a hashed/w salt pw
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * Model methods: 'this' is the user model instance
 */
userSchema.statics.findByToken = function (token) {
  // model instance
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }
  // returns a promise
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  const User = this;
  // return promise to server
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    // try bcrypt in a promise (not supported by default)
    return new Promise((resolve, reject) => {
      // compare a users plaintext input to our hashed DB value
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

/**
 * Instance methods: 'this' is the document object req instance
 */
// To transform the object returned to the user (minus password)
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  return _.pick(userObj, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
  // 'this' is the calling object from the express req body
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();
  // update user model
  user.tokens = user.tokens.concat([{ access, token }]);
  // returns our token as a Promise so we can update our response header
  return user.save().then(() => token);
};

userSchema.methods.removeUserToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token },
    },
  });
};

// Reference our new schema
const User = mongoose.model('User', userSchema);

module.exports = { User };
