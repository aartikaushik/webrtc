var express = require('express');
var app= express();

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var shortid = require('short-id');
 

var PORT = process.env.PORT || 5000


http.listen(PORT, function(){
console.log("listening");
});

app.use(express.static('public'));

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
    db_insert(msg,unique_id)
  });

});

const { Pool } = require('pg');
	const pool = new Pool({
	  connectionString: process.env.DATABASE_URL,
	  ssl: true
	});


function db_insert(msg,unique_id) {

	
	app.get('/db', async (req, res) => {
	  try {
	const client = await pool.connect()   
	var x = 3;

	while (x > 0) {
	    client.query("INSERT INTO provide_connection values($1, $2, $3)", [5, msg, unique_id]);
	  
	    x = x - 1;
	}
	    const result = await client.query('SELECT * FROM provide_connection');
	    res.send(result.rows)
	    client.release();
	  } catch (err) {
	    console.error(err);
	    res.send("Error " + err);
	  }
	});
}

const { Pool1 } = require('pg');
	const pool1 = new Pool1({
	  connectionString: process.env.DATABASE_URL,
	  ssl: true
	});

app.get('/:unique_id', async (req,res){

  try {
	const client1 = await pool.connect()   
	
	    const result1 = await client1.query('SELECT * FROM provide_connection');
	    res.send(result1.rows)
	    client1.release();
	  } catch (err) {
	    console.error(err);
	    res.send("Error " + err);
	  }
// res.send(req.params.unique_id)

});


