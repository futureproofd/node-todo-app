//Assertion and express testers
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//test data
const todos = [{
    _id: new ObjectID(),
    text:'test todo1'
    },
    {
    _id: new ObjectID(),
    text:'test todo2'
    }
];

//Empty and load the database with test data
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
   
    it('should create a new todo', (done) => {
        var text = 'test todo';
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) =>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res) =>{
                if(err){
                  return done(err);
                }
                //check DB
                Todo.find({text}).then((todos) =>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch((e) => done(e));
            });
    });
    
    it('should not create todo with invalid body', (done) =>{
       //expect 400
        //expect 0 db results
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res) => {
            if(err){
                return done(err);
            }    
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done()
            }).catch((e) => done(e));    
        });
    });
});


describe('GET /todos', () => {
    it('should get all todos', (done) => {
       request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
           expect(res.body.todos.length).toBe(2);
       })
        .end(done);
    });
    
});


describe('GET /todos/:id', () =>{
    it('should return todo doc', (done) =>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
        
    });
    
    it('should return a 404 if valid id not found', (done) =>{
       request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });
    
    it('should return a 404 for invalid id', (done) =>{
       request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});
