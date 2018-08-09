const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {

    if(err) {
        console.error(`Unable to connect to mongo db ${err}`);
        return ;
    }
    console.log('Successfully connected');

    // db.collection('todo').deleteMany({
    //     text: 'Something too do'
    // }).then((result) => {
    //     console.log(result);
    // }); 


    // db.collection('todo').deleteOne({
    //     text: 'Something to do'
    // }).then((result) => {
    //     console.log(result);
    // }) ;

    // db.collection('todo').findOneAndDelete({
    //     text:'Something too do'}).then((result) => {
    //         console.log(result);
    // });

    // db.collection('Users').deleteMany({name: 'Abhigyan'}).then((result) => {
    //     console.log(result);
    // });


    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b2d0bce767da11e03734b69')}).then((result) => {
        console.log(result);
    });
    

});

