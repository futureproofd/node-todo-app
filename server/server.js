//Server
var express = require('express');
var bodyParser = require('body-parser');

//DB & Model
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

//receive post requests from users
app.post('/todos', (req, res) => {
    var todo = new Todo({
       text: req.body.text 
    }); 
    
    //save mongoose-defined obj to DB
    todo.save().then((doc) => {
        res.send(doc); 
    }, (e) => {
        res.status(400).send(e);
    });
});

//get request
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({todos});
   }, (e) => {
       res.status(400).send(e);
   });
});

//start server
app.listen(3000, () => {
   console.log('Started on Port 3000'); 
});

//export server for testing purposes
module.exports = {app};