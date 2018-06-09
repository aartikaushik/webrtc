var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var shortid = require('short-id');
 var dbOperations = require("./dbOperations.js");

var PORT = process.env.PORT || 5000



app.get('/', function(req, res){

 res.sendFile(__dirname + '/client/index.html');

});

http.listen(PORT, function(){
console.log("listening");
});


io.on('connection', function(socket){
  
  console.log('a user connected');

socket.on('disconnect', function(){
    console.log('user disconnected');
  });
socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    var unique_id = shortid.generate()
    console.log(unique_id);
    socket.emit('id', unique_id);
    
  });

});
app.get('/db/readRecords', function(req,res){
    dbOperations.getRecords(req,res);
});


