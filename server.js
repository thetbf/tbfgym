var express        =         require("express");
var bodyParser     =         require("body-parser");
var webs = require('./app/app.js');
var webs2 = require('./app/signup.js');
var webs3 = require('./app/subscribe.js');

var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});
app.put('/signup', function (req, res) {
   var userData = {
       reqId: "signup",
         uid: req.query.uid,
       email: req.query.email,
       fname: req.query.fname,
       lname: req.query.lname,
      passwd: req.query.pwd,
         mbl: req.query.mobile,
       addr1: req.query.address
   };
   var z = webs2.signup(JSON.stringify(userData), function(response) {
    res.send(JSON.stringify(JSON.parse(response)));
  });
});

app.get('/gallery',function(req,res){
  res.sendFile(__dirname + "/gallery.html");
});

app.get('/report', function (req, res) {
   var x = {reqId: "report"};
   var z = webs.foo(x, function(response) {
    res.send(JSON.stringify(JSON.parse(response)));
   });
});

app.get('/payment', function (req, res) {
  console.log("Called in the endpoint /payment w/ amount: "+req.query.amt);
   var x = {
    reqId: "payment",
    uid: req.query.uid,
    amt: req.query.amt
  };
   var y = JSON.stringify(x);
   var z = webs3.subscribe(y, function(response) {
    res.send(JSON.stringify(JSON.parse(response)));
   });
});
app.get('/attendence', function (req, res) {
  console.log("Called in the endpoint /attendence w/ uid: "+req.query.uid);
   var x = {
    reqId: "attendence",
    uid: req.query.uid
  };
   var y = JSON.stringify(x);
   var z = webs3.subscribe(y, function(response) {
    res.send(JSON.stringify(JSON.parse(response)));
   });
});

app.get('/subscribeme', function (req, res) {
   var x = {
    reqId: "subscribe",
    fname: req.query.namefirst
   };
   var y = JSON.stringify(x);
   var z = webs3.subscribe(y, function(response) {
    res.send(JSON.stringify(JSON.parse(response)));
   });
});

app.listen(8888,function(){
  console.log("Started on PORT 8888");
});