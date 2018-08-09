
const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            }, 
            message: '{value} is not a valid email'   
        }   
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true

        },
        token: {
            type: String,
            required: true

        }
    }]

});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email'])

};

UserSchema.methods.generateAuthToken = function() {
    let user = this ;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens.push({access,token});

    return user.save().then(() => {
        return token;
    });
}; 



const Users = mongoose.model('Users',UserSchema);


module.exports = {
    Users
};