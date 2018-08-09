const {ObjectID} = require('mongodb');

const {mongoose } = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');


var id = "6b2e1e1bfa17d93aa76d242343";

// if(!Object.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log(`Todos : ${todos}`)
// });


// Todo.findOne({
//     _id: id
// }).then((todos) => {
//     console.log(`Todos : ${todos}`)
// });


// Todo.findById(id)
//     .then((todo) => {
//         if(!todo) {
//             return console.log('ID not found');
//         }
//         console.log(`Todo By ID ${todo}`);
//     }, (error) => {
//         console.log(error);
//     });

Users.findById(id)
    .then((user) => {
        if(!user) {
            return console.log(`ID not found`);
        }
        console.log(`Users By ID ${user}`);
    }, (error) => {
        console.log(error);
    });