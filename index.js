var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var shortid = require('short-id');
 

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


var connectionString = "postgres://bymbnvfyrosgvz:1aee5875cdbedd2d8c4fbbb9c1f9b44088f2b36111f9c78090cbf58986e9f8e1@ec2-54-225-107-174.compute-1.amazonaws.com:5432/d3gvoum1kvv887"
 
pg.connect(connectionString, function(err, client, done) {
   client.query('SELECT * FROM provide_connection', function(err, result) {
      done();
      if(err) return console.error(err);
      console.log(result.rows);
   });
});


