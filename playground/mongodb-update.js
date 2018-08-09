const  {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (error,db) => {
    if(error) {
        console.log(error);
    }

    // db.collection('todo').findOneAndUpdate({
    //     _id: new ObjectID('5b2d08d8ff0fd81b00995c14')
    // },{
    //     $set: {
    //         completed: true
    //     }

    // },{
    //     returnOriginal: false,
    // }).then((result) => {
    //     console.log(result);
    // }) ;

    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID('5b2d187cafe6382a6395ea19'),

        },
        {
        $set: {
            name: 'Abhigyan'
            },
        $inc : {
            age: 2
            }
        },
        {
        returnOriginal: false
        }
        ).then((result) => {
        console.log(result);
    });
});

