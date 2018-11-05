//Server
var express = require('express');
var bodyParser = require('body-parser');

//DB & Model
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());

/*
 * Routes
 */

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

//get requests
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({todos});
   }, (e) => {
       res.status(400).send(e);
   });
});

//get single todo
app.get('/todos/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo}); 
    }, (e) => {
        res.status(400).send(e);
    });
});

//delete a todo
app.delete('/todos/:id',(req,res)=>{
   var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
       if(!todo){
           return res.status(404).send();
       }
       res.status(200).send();
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//start server
app.listen(port, () => {
   console.log(`Started on Port ${port}`); 
});

//export server for testing purposes
module.exports = {app};