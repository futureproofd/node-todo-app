const { MongoClient, ObjectID } = require('mongodb');

let newId = new ObjectID();
console.log(newId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to the database', err);
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos')
    .findOneAndUpdate(
      {
        _id: new ObjectID('5bcf3f2f2ca04da12faad4ba'),
      },
      {
        $set: {
          completed: true,
        },
      },
      {
        returnOriginal: false,
      },
    )
    .then((result) => {
      console.log(result);
    });

  db.close();
});
