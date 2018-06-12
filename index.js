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

app.get('/:uni_id', async (req, res) => {
	try {
		const client = await pool.connect()
                client.query("INSERT INTO provide_connection values($1, $2, $3)", [1, msg, unique_id]);
		const result = await client.query('SELECT request_string FROM provide_connection where url_id = $1', [req.params.uni_id]);
		var user = result.rows
		res.send(user)
		client.release();
	} 
	catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});





}










