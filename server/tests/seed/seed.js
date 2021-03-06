const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

// get IDs for testing
const userId1 = new ObjectID();
const userId2 = new ObjectID();

// test user data with and without tokens
const users = [
  {
    _id: userId1,
    email: 'fakeemail@fake.com',
    password: '123abc',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userId1, access: 'auth' }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
  {
    _id: userId2,
    email: 'fakeemail2@fake2.com',
    password: '123abc',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userId2, access: 'auth' }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'test todo1',
    _creator: userId1,
  },
  {
    _id: new ObjectID(),
    text: 'test todo2',
    _creator: userId2,
  },
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
};

// populate test user DB and execute middleware to hash our passwords
const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      // resolve all
      return Promise.all([user1, user2]);
    })
    .then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers,
};
