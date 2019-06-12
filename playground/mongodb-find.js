/* eslint-disable no-shadow */
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to the database', err);
  }
  console.log('Connected to MongoDB server');

  db.collection('Users')
    .find({ name: 'Marcus' })
    .toArray()
    .then(
      (docs) => {
        console.log('Users:');
        console.log(JSON.stringify(docs, undefined, 2));
      },
      (err) => {
        console.log('Error finding record(S)');
      },
    );

  db.close();
});
