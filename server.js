var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var mongodb = require('mongodb');

var d = new Date();
 

var uri = '';


app.use(bodyParser());


app.get('/', function(req, res){
  res.sendFile(__dirname + "/views/index.html")
});

app.get('/signup', function(req, res){
  res.sendFile(__dirname + "/views/sign-up.html")
});

app.post('/signup', function(req, res){
  var hashedlogin = bcrypt.hashSync(req.body.login, 10);
  var hashedpassword = bcrypt.hashSync(req.body.password, 10);
  console.log(hashedlogin)
  mongodb.MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
var users = db.collection('users');
users.find({
                "login": hashedlogin
            }).toArray(function(err, data) {
                if (JSON.stringify(data).length < 3) {            //The login name does not exist
                 users.insert({
                        "login": hashedlogin,
                        "password": hashedpassword,
                        "date": d.toLocaleString()
});
                 
                  res.end("new entry created");
                  console.log("new entry created");
                  db.close();
}
else{
  console.log("this username already exists, choose another one!")
  res.end("this username already exists, choose another one!")
  db.close();
}
});
});
  res.end()
});

app.post('/api', function(req, res){
  console.log(JSON.stringify(req.body))
  res.end();
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
