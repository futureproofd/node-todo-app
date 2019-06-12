// require our database and our model
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// require objectId library from mongo
const { ObjectID } = require('mongodb');

let id = '5bd86baedd57f1040ac3c7fd';
let userId = '5bcf88c9c5f3f2301c2e979d';

// remove all
// Todo.remove({}).then((result) =>{
//   console.log(result);
// });

Todo.findOneAndRemove({ _id: '5bdb38212ca04da12fac007f' }).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('5bdb38212ca04da12fac007f').then((todo) => {
  console.log(todo);
});
