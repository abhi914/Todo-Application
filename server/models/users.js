const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function() {
    const user = this;

    const access = 'auth';
    const token = JWT.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);

    user.tokens.push({access, token});

    return user.save()
            .then(() => {
            return token;
        });
};

userSchema.methods.removeToken = function(token) {
        const user = this;
        
        return  user.update({
            $pull: {
                tokens: {
                    token
                }
            }
        });
};



userSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded ;

    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET);
    }
    catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,    
        'tokens.token': token,
        'tokens.access': 'auth' 
    }) ;
} ;

// userSchema.statics.findByCredentials = function (email, password) {
//     const User = this;

//     return User.findOne({email}).then((user) => {
//         if(!user) {
//             return Promise.reject();
//         }

//         return bcrypt.compare(password, user.password)
//             .then((res) => {
//                 if(!res) {
//                     return user;
//                 }
//                 throw new Error('Problem Here');
//             });
//     });
// };


userSchema.statics.findByCredentials = function (email, password) {
    var User = this;
  
    return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }
  
      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        // console.log(user);
        bcrypt.compare(password, user.password, (err, res) => {
            // console.log(res);
          if (!res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
  };
  

userSchema.pre('save', function (next) {
    
    const user = this;
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(user.password, salt, (err, res) => {
            user.password = res;      
            next();     
        });
    });
});

const User = mongoose.model('Users', userSchema);

module.exports = {
    User
};