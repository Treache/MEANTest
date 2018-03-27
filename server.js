const express = require('express');
const router = express.Router();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
var mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

var db;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Inserting documents into the database
app.post('/api/post', function(req, res) {
    /* Log the POST from the api call and write the request body to the window */
    pushToDB(req.body);
    console.log(req.body);
    res.json(req.body);
});

// Updating a specific document in the database
app.post('/api/update/:show', function(req, res) {
    console.log(req.params.show);
    console.log(req.body.show);
    var query = { show: req.params.show };
    db.collection('series').updateOne(query, { $set: { show: req.body.show, seasons: req.body.seasons, type: req.body.type }  }, function(err, result) {
        if(err) return console.log("Error updating document: " + err);
        res.json(result);
    });
});

// Retriveing all the documents from database
app.get('/api/get', function(req, res) {
    db.collection('series').find().toArray(function(err, results) {
        if (err) return console.log(err);
        res.json(results);
    });
});

// app.get('/api/get/:id', function(req, res) {
//     console.log("Getting rid of " + req.params.id);
//     db.collection('series').remove({_id: new mongodb.ObjectID( req.body)}, function(err, result){

//     });
// });

app.get('/api/delete/:show', function(req, res) {
    console.log("Trynna remove!");
    console.log(req.body.show);
    var query = { show: req.params.show };
    db.collection('series').deleteOne(query, function(err, result){
        if(err) return console.log("Error deleting the document from database: " + err);
        // console.log(result);
        res.json(result);
    });
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);

//Create the connection to the MongoDB && start the webserver on localhost:3000
MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if (err) return console.log(err);
    db = client.db('series');
    server.listen(port, function() {
        console.log('ErfanTest is now running on localhost:' + port);
        init_db();
    });
});





/*

    Prepare the database with one entry

 */
var init_db = function() {
    db.collection('series').findOne({'show': 'The Simpsons'}, function (err, found) {
        if (typeof(found) === "undefined" || found === null) {
            var series = {
                'show': 'The Simpsons',
                'seasons': 28,
                'type': 'Animated'
            };
            db.collection('series').save(series, function (err, result) {
                if (err) return console.log(err);
                console.log('Saved ' + series.show);
                console.log('Database prepared.');
            });
        }
    });
}

// Method to push(insert) data to database 
// series : object
var pushToDB = function(series){
    console.log("Inserting data to database...");
    db.collection('series').save(series, function (err, result) {
        if (err) return console.log("Error inserting document to datatbase: " + err);
        console.log(series.show + " saved to database.");
    })
}