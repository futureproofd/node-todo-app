const { MongoClient, ObjectID } = require('mongodb');

let newId = new ObjectID();
console.log(newId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to the database', err);
  }
  console.log('Connected to MongoDB server');

  // Delete many
  //    db.collection('Todos').deleteMany({text:'walk the dog'}).then((result) => {
  //        console.log(result);
  //    });

  // find one and delete
  db.collection('Todos')
    .findOneAndDelete({ completed: false })
    .then((result) => {
      console.log(result);
    });

  db.close();
});
