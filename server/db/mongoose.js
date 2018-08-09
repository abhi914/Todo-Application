const mongoose = require('mongoose');

<<<<<<< HEAD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Todo');


module.exports = {
    mongoose
=======

// mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');


module.exports = {
    mongoose 
>>>>>>> feee45c2ec02deff0a8f81235082e07fd5763d5e
};