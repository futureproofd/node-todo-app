/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

const newId = new ObjectID();
console.log(newId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to the database', err);
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').insertOne(
    {
      text: 'Something to do',
      completed: false,
    },
    (err, result) => {
      if (err) {
        return console.log('unable to insert todo', err);
      }
      console.log(JSON.stringify(result.ops, undefined, 2));
    },
  );

  db.collection('Users').insertOne(
    {
      name: 'Marcus',
      age: 300,
      location: 'Toronto',
    },
    (err, result) => {
      if (err) {
        return console.log('unable to insert user', err);
      }
      console.log(JSON.stringify(result.ops, undefined, 4));
    },
  );

  db.close();
});
