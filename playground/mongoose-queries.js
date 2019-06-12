/* eslint-disable no-console */
// require objectId library from mongo
const { ObjectID } = require('mongodb');
// require our database and our model
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const id = '5bd86baedd57f1040ac3c7fd';
const userId = '5bcf88c9c5f3f2301c2e979d';

if (!ObjectID.isValid(id)) {
  // do someting
}

// ex1
// Todo.find({
//    _id:id
// }).then((todos) =>{
//   console.log('Todos', todos);
// });
//
// ex2
// Todo.findOne({
//    _id:id
// }).then((todo) =>{
//   console.log('Todo', todo);
// });

// ex3
Todo.findById(id)
  .then((todo) => {
    if (!todo) {
      return console.log('id not found.');
    }
    console.log('Todo', todo);
  })
  .catch((e) => {
    console.log(e);
  });

User.findById(userId)
  .then((user) => {
    if (!user) {
      return console.log('user not found');
    }
    console.log('user', user.email);
  })
  .catch((e) => {
    console.log(e);
  });
