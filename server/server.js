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



app.listen(3000, () => {
   console.log('Started on Port 3000'); 
});