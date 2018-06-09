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

app.get('/db', function(req, res){

var pg = require('pg');
var conString = process.env.DATABASE_URL;

var client = new pg.Client(conString);
client.connect();

var x = 3;

while (x > 0) {
    client.query("INSERT INTO test_table values(1,'sfjhs')");
    
    x = x - 1;
}

var query = client.query("SELECT * FROM test_table");
//fired after last row is emitted
    res.send(query.rows);
    client.release();

});
