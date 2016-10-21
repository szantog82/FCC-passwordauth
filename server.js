var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var mongodb = require('mongodb');

var d = new Date();
 var loginmatch = false;
 var passwordmatch = false;
 var position = 0;

var uri = '';


app.use(bodyParser());


app.get('/', function(req, res){
  res.sendFile(__dirname + "/views/index.html")
});


app.get('/signup', function(req, res){
  res.sendFile(__dirname + "/views/sign-up.html")
});

app.post('/signup', function(req, res){
  loginmatch = false;
  passwordmatch = false;
  var login = req.body.login;
  var password = req.body.password;
  var hashedlogin = bcrypt.hashSync(login, 10);
var hashedpassword = bcrypt.hashSync(password, 10);
  mongodb.MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
var users = db.collection('users');
users.find({}).toArray(function(err, data) {
  var input = data;
  console.log("fetching datas")
              for (var i = 0; i < input.length; i++) {
               console.log(input[i].login)
                if (bcrypt.compareSync(login, input[i].login)) {loginmatch = true; position = i;
              }
                
              }
              if (loginmatch) {
                if (bcrypt.compareSync(password, input[position].password)){
                 res.end("password && login matches");
                db.close();} 
                
                else{
                res.end("password mismatch");
                db.close();}
              }
              
              else {
                 users.insert({
                        "login": hashedlogin,
                        "password": hashedpassword,
                        "date": d.toLocaleString()
});
                 
                  res.send("new entry created");
                  console.log("new entry created");
}

  db.close();
});
});
});




app.post('/api', function(req, res){
  console.log(JSON.stringify(req.body))
  res.end();
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
