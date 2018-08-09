require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');
const {authenticate} = require('./middleware/authenticate');


const app = express();


app.use(bodyParser.json());


app.post('/todos', authenticate, (req,res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((todo) => {
        res.send(todo);
    }, (error) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req,res) => {
    Todo.find({
        _creator: req.user._id
    })
    .then((Todos) => {
        res.send(Todos);
    }, (error) => {
        res.status(400).send(error)
    });
});

app.get('/todos/:id', authenticate, (req,res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
    .then((Todos) => {
        if(!Todos) {
            return res.status(404).send();
        }
        else {
            res.send(Todos);

        }
    }, (error) => {
        res.status(400).send(error);
    });
});

app.delete('/todos/:id',authenticate, (req,res) => {
    const id = req.params.id ;

    if(!ObjectID.isValid(id))
        return res.status(400).send();

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    })
    .then((todos) => {
        res.send({todos});
    }, (error) => {
        res.status(404).send();
    });        
});

app.patch('/todos/:id', authenticate, (req,res) => {
    const id = req.params.id;

    if(!ObjectID.isValid) {
        return res.status(404).send();
    }

    const body = _.pick(req.body, ['text','completed']);

    if(_.isBoolean(body.completed) && body.completed) {
        body.completed = true;
        
    }
    else {
        body.completed = false;
       
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set:body} ,{new: true})
    .then(todo => {
        if(!todo) {
            return res.status(404).send();
        }
        else {
            res.send(todo);
        }
    }).catch(e => {
        res.status(400).send();
    });
});








app.post('/users', (req,res) => {
    const body = _.pick(req.body, ['email', 'password']);
    
    const user = new User(body);

    user.save()
    .then((user) => {
        return user.generateAuthToken();
        // res.send(user);
    }).then(token => {
        res.header('x-auth',token).send(user);
    }).catch(e => {
        res.status(401).send(e);
    });    
});




app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);    
});


app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    // res.send(body);

    User.findByCredentials(body.email, body.password)
        .then((user) => {
             return user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token).send(user);
                });
        }).catch((e) => res.status(400).send(e));
});



app.delete('/users/me/logout',authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send(err);
    }) ;
});


app.listen(3100, (error) => {
    if(error) {
        console.error(error);
    }
    console.log("Server started at 3100");
});


module.exports =  {
    app
};
