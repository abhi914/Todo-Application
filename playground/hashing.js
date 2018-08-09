<<<<<<< HEAD
const {SHA256} = require('crypto-js');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// const data = {
//     id: 4
// };

// const oldHashedData = SHA256(JSON.stringify(data)).toString();

// const hashedData = SHA256(JSON.stringify(data) + '123').toString();
// console.log(hashedData);

// if(oldHashedData === hashedData) {
//     console.log("data was compromised");
// }
// else {
//     console.log("data was not compromised");
// }

// const data = {
//     id: 3
// };

// const hashedData = JWT.sign(JSON.stringify(data), '124abc');

// console.log(hashedData);
// const decodedData = JWT.verify(hashedData, '124abc');

// console.log(decodedData);



const password = "tinderBC<3";


bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

bcrypt.compare(password, '$2a$10$gb5t4L8uiBWKgF9tnnEhce1w0T0P1DQpMXRtCj0FNcixXoRQF3cn.', (err,res) => {
    console.log(res);
})
=======
const {SHA256}= require('crypto-js');
const jwt = require('jsonwebtoken');

var data= {
    id: 10
};


var token = jwt.sign(data,'123abc');
console.log(token);


var decoded = jwt.verify(token,'123abc');

console.log(`Decoded : ${JSON.stringify(decoded)}`);

// var message = "I am user Number 3";

// var hash = SHA256(message).toString();

// console.log(`Message :${message}`);
// console.log(`Encrypted Form: ${hash}`);


// var data = {
//     id: 4
// };


// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+ 'somesecret').toString()
// }

// // token.data.id =5 ;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed ');
// }
// else {
//     console.log(`Data was changed. Do not trust`);
// }

>>>>>>> feee45c2ec02deff0a8f81235082e07fd5763d5e
