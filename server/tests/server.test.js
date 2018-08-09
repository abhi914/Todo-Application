const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('../models/users');
const {todos, populateTodos, users, populateUsers} = require('../tests/seed/seed');

const {ObjectID} = require('mongodb');
const request = require('supertest');
const expect = require('expect');


beforeEach(populateTodos);
beforeEach(populateUsers);


describe('POST /todos', () => {
    it('should send POST request', (done) => {
        const text = "Stores the todo";

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }
            
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should return all the todos', (done) => {
        
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)       
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();                
            }).catch((e) => done(e));
        });
    });
});


describe('GET /todos/:id', () => {
    it('should return the specified todo', (done) => {
              
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(todos[0].text);
                // console.log(res.body.text);
            })
            .end(() => done());
    });
    it('should not return the specified todo created by other Todo', (done) => {              
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)           
            .end(() => done());
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
        const hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)            
            .expect(200)
            .expect(res => {
                expect(res.body.todos._id).toBe(hexId);
                // console.log(res.body);
            })
            .end((err, res) =>  {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then(todo => {
                    // expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404  a todo', (done) => {
        const hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)            
            .expect(404)            
            .end((err, res) =>  {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then(todo => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e));
            });
    });
}); 

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const hexId = todos[0]._id.toHexString();
        const text = "please update this text";

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)                    
        .send({
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
        })
        .end(() => done());        
    });             

    it('should update the todo', (done) => {
        const hexId = todos[1]._id.toHexString();
        const text = "please update this text";

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)                    
        .send({
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
        })
        .end(() => done());        
    });             
});




describe('GET users/me', () => {
    it('should return user If authenticated', (done) => {

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(() => done());
    });

    it('should return a 401 If not authenticated', (done) => {         

        request(app)
        .get('/users/me')
        .expect(401)
        .end(() => done());
    });
});


describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'gadha@gmail.com';
        const password = '123mdb';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
            if(err)
                return  done(err);
            
            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
                }).catch(e => {
                    console.log(e);
                    done();
                })  ;
            });
    });
    it('should return validation errors, if request, invalid' , (done) => {
        const email = "adbnasjkd";
        const password = "1";

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(() => done());
    });

    it('should not create user if email in user', (done) => {
        const email = 'gadha@gmail.com';
        const password = '123abc';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(() => done());
    });
});

// describe('POST /users/login', () => {
//     it('should login user and return auth token', (done) => {
//         request(app)
//             .post('/users/login')
//             .send({
//                 email: users[1].email,
//                 password: users[0].password
//             })
//             .expect(200)
//             .expect((res) => {
//                 expect(res.headers['x-auth']).toBeTruthy();
//             })
//             .end((err, res) => {
//                 if(err) 
//                     return done(err);
                
//                 User.findById(users[1]._id).then((user) => {
//                     expect(user.tokens[0]).toInclude({
//                         access: 'auth',
//                         token: res.headers['x-auth']
//                     });
//                     done();
//                 }).catch(e => done(e));
//             });
//     });

//     it('should reject invalid login', (done) => {
//         request(app)
//         .post('/users/login')
//         .send({
//             email: users[1].email,
//             password: '2131'
//         })
//         .expect(400)
//         .expect((res) => {
//             expect(res.headers['x-auth']).not.toBeTruthy()
//         })
//         .end((err,res) => {
//             if(err)
//                 return done(err);
//             User.find(users[1]._id).then((user) => {
//                 expect(user.tokens.length).toBe(0);
//                 done();
//             }).catch(e => done(e)) ;
//         });
//     });
// });


describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
        .delete('/users/me/logout')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(e => done(e));
        });
    });
})