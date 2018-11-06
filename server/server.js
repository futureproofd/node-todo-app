//Server
const express = require('express');
const bodyParser = require('body-parser');

//DB & Model
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

//extras
const _ = require('lodash');

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
       res.status(200).send({todo:todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//Update a todo
app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
    }else{
      body.completed = false;
      body.completedAt = null;
    }
    //update todo
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
});

//start server
app.listen(port, () => {
   console.log(`Started on Port ${port}`);
});

//export server for testing purposes
module.exports = {app};
