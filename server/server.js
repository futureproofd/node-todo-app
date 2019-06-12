/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

// config
require('./config/config');
// Server
const express = require('express');
const bodyParser = require('body-parser');
// extras
const _ = require('lodash');
// DB & Model
const { ObjectID } = require('mongodb');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();

// middleware
app.use(bodyParser.json());

/*
 * Routes
 */

// receive post requests from users
app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  // save mongoose-defined obj to DB
  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    },
  );
});

// get requests
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id,
  }).then(
    (todos) => {
      res.send({ todos });
    },
    (e) => {
      res.status(400).send(e);
    },
  );
});

// get single todo
app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id,
  }).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    },
    (e) => {
      res.status(400).send(e);
    },
  );
});

// delete a todo
app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id,
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// Update a todo
app.patch('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  // update todo
  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id,
    },
    { $set: body },
    { new: true },
  )
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send({ todo });
    })
    .catch((e) => {
      res.status(400).send();
    });
});

// new user
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  // pass body as constructor args (only contains email/pw)
  const user = new User(body);
  user
    .save()
    .then(
      () => user.generateAuthToken(),
      // actually returns our promise result, which is a token
    )
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// login user
app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(() => user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      }),)
    .catch(() => {
      // promise result from model
      res.status(400).send();
    });
});

// logout user
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeUserToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    },
  );
});

// user authentication middleware
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Started on Port ${process.env.PORT}`);
});

// export server for testing purposes
module.exports = { app };
