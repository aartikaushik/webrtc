var express = require('express')
var app= express()
var http = require('http').createServer(app)
var io = require('socket.io').listen(http)
var shortid = require('short-id')
 
var PORT = process.env.PORT || 5000

http.listen(PORT, function(){
	console.log("listening")
})

app.use(express.static('public'))

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
})

io.on('connection', function(socket){
	console.log('a user connected')

	socket.on('disconnect', function(){
		console.log('user disconnected')
	})

	socket.on('request string', async function(msg){
                if(msg.role == 'initiator')
		{
			var unique_id = shortid.generate()
			const client = await pool.connect()
		        client.query("INSERT INTO provide_connection values($1, $2, $3)", [1, msg.req_str, unique_id])
			socket.emit('id', unique_id)
		}
		
	})

app.get('/:uni_id', function(req, res){
res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

});






