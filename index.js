// including express
var express = require('express');
var app= express();

// creating server
var http = require('http').createServer(app);

// including socket.io and shortid
var io = require('socket.io').listen(http);
var shortid = require('short-id');

// dynamic port on heroku or 5000 on localhost
var PORT = process.env.PORT || 5000;

// server listening for the client to connect
http.listen(PORT, function(){
	console.log("listening");
})

// rendering index.html from public folder as the home page
app.use(express.static('public'));

// for keeping track of initiator and receiver socket
var data=[];

// on socket connection between server and client
io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function(){
		console.log('user disconnected');
	})

	// offer(request string) sent by initiator is catched here
	socket.on('request string', function(msg){
        if(msg.role == 'initiator')
		{
			var unique_id = shortid.generate();
		    data.push({"initiator_text": msg , "url_id": unique_id , "initiator_socket": socket , "receiver_text": "" , "receiver_socket": "" });
  			socket.emit('id', unique_id);
		}		
	})

	// role and unique_id sent by receiver as initial greeting
	socket.on('receiver welcome', function(greeting){
		if(greeting.role == 'receiver')
		{
			var data_len = data.length;
			for (var i = 0; i < data_len; i++) 
			{
				if(data[i] != undefined) 
				{
					if(data[i].url_id == greeting.url_id)
					{
						data[i].receiver_socket = socket;
						var rec_soc = data[i].receiver_socket;
						var ini_text = data[i].initiator_text.req_str;
						break;
					}  
			    }
			}

			// send initiator text onto receiver socket
			rec_soc.emit('initiator text', ini_text);
		}
	})

	// on receiving answer(reply) of offer(initiator text/ request string) from receiver side is catched here
	socket.on('receiver answer', function(answer){
		var data_len = data.length;
		for (var i = 0; i < data_len; i++) 
		{
			if(data[i] != undefined)
			{
				if(data[i].url_id == answer.url_id)
				{
					data[i].receiver_text = answer.receiver_text;
					var ini_soc = data[i].initiator_socket;
					break;
 				} 
			}
		}

		// sending receiver answer on initiator socket
		ini_soc.emit('receiver answer', answer.receiver_text);

		// deleting the entry so as to cut of signaling server
		for (var i = 0; i < data_len; i++) 
		{
			if(data[i] != undefined)
			{  
				if(data[i].url_id == answer.url_id)
				{
					delete data[i]; // deleting entry will make that index undefined
					break;
 				}
            }  
	    }
	})
})

// rendering index.html for receiver hitting the url having unique id
app.get('/:uni_id', function(req, res){
	res.sendFile( __dirname + "/public/" + "index.html" )
})






