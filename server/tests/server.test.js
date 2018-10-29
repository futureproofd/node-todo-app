//Assertion and express testers
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//always empty the databaase prior to test
beforeEach((done) => {
    Todo.remove({}).then(() => done());
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
                Todo.find().then((todos) =>{
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
                expect(todos.length).toBe(0);
                done()
            }).catch((e) => done(e));    
        });
        
    });
});