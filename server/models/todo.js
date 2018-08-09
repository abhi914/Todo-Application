const {mongoose}  = require('../db/mongoose');

const Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    createdAt: {
        type: String
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});


module.exports = {
    Todo
};