var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 5000



app.get('/', function(req, res){

 res.send("hello world");

});

app.listen(port);
