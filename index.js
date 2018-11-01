const express = require('express');
const app = express();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url, {
    useNewUrlParser: true
});

app.use(express.json());

// Use connect method to connect to the Server
client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
});

app.get('/workouts', (req, res) => {
    const db = client.db(dbName)
    getWorkouts(db, (response) => {
        res.send(response);
        client.close;
    })
})

app.post('/workout', (req, res) => {
    const db = client.db(dbName)
    let object = req.body
    insertWorkout(db, object, () => {
        client.close;
    })
    res.json(object);
})

app.get('/workout/:id', (req, res) => {
    const db = client.db(dbName);

    getWorkoutById(db, req.params.id, (response) => {
        client.close;
        res.json(response);
    })

})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

const insertWorkout = (db, object, callback) => {
    client.connect((err) => {
        const collection = db.collection('workout');
        collection.insertOne(object);
    });
    console.log(object);
    callback(object);
}

const getWorkouts = (db, callback) => {
    client.connect((err) => {
        const collection = db.collection('workout');
        collection.find({}).toArray((err, results) => {
            console.log("get ALL: " + JSON.stringify(results));
            callback(results);
        });
    })
}

const getWorkoutById = (db, id, callback) => {
    client.connect((err) => {
        const collection = db.collection('workout');

        collection.find({
            _id: `ObjectId(${id})`
        }).toArray((err, results) => {
            console.log(`find by id ${id} the object ${JSON.stringify(results)}`);
            callback(results);
        })
    })
}