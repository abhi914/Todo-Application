const {ObjectID} = require('mongodb');
const JWT = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/users');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'abhigyan.nayak@gmail.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: JWT.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'anand.nayak87@gmail.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token:JWT.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    }
];

const todos = [
    {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];


const populateTodos = () => {
    return Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
    }).catch((e) => console.log(e));
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());    
};



module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};