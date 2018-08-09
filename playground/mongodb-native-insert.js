const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Todo', (err,db) => {

    if(err) {
        return console.log("Unable to connect to mongodb server");
    }

    db.collection('Todos').find().toArray().then((docs) => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log("UNable to fetch todos");
    }) ;
    db.close();
});

