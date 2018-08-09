const MongoClient = require('mongodb').MongoClient ; 


MongoClient.connect('mongodb://localhost:27017/todoApp', (err,db) => {
    
    if(err) {
        console.error(`unable to connect to server ${err}`);
        return;
    }

    console.log(`Successfully connected to mongo Server`);

    // db.collection('todo').insertOne({
    //     text: 'Something to do',
    //     completed: false

    // }, (err,result) => {

    //     console.log('Data inserted')
    //     console.log(JSON.stringify(result.ops, undefined, 2));

    // });


    db.collection('Users').insertOne({
        name: 'Abhi',
        age: 20,
        location: 'afghanistan'
    },(err, result) => {
        if(err) {
            console.error(`Unable to insert data ${err}`);
            return;
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });


    // db.collection('todo').find({completed: false}).count().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log(`Unable to fetch data ${error}`);
    // });


    // db.collection('Users').find({name:'Abhigyan'}).count().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log(`Unable to fetch data ${error}`);
    // });

    // db.close();
         
});