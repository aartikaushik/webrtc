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

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

try {
    const client = await pool.connect()

var x = 3;

while (x > 0) {
    client.query("INSERT INTO test_table values(5,'dsfh')");
    
    x = x - 1;
}
    const result = await client.query('SELECT * FROM test_table');
    console.log(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    
  }
    
  });

});




