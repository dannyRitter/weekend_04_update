var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/weekend_challenge_04';
console.log("Connection: ", connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

app.get('/data', function(req,res) {
    var results = [];

    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT id, name, message FROM messages ORDER BY id ASC");

        query.on('row', function (row) {
            results.push(row);
        });

        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        if (err) {
            console.log(err);
        }
    });
});



app.post('/data', function(req,res){
    console.log(req);

    var addedMessage = {
        "name" : req.body.inputName,
        "message" : req.body.inputMessage
    };

    pg.connect(connectionString, function (err, client) {
        client.query("INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING id", [addedMessage.name, addedMessage.message],
            function(err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }

                res.send(true);
            });
    });
});



app.get("/*", function(req, res){
    var file = req.params[0] || "index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});


app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), function(){
    console.log("Heyo is this thing working? " + app.get("port"));
});