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

var data=[]
io.on('connection', function(socket){
	console.log('a user connected')

	socket.on('disconnect', function(){
		console.log('user disconnected')
	})
	socket.on('request string', function(msg){
                if(msg.role == 'initiator')
		{
			var unique_id = shortid.generate()
		        data.push({"initiator_text": msg , "url_id": unique_id , "initiator_socket": socket , "receiver_text": "" , "receiver_socket": "" })
  			socket.emit('id', unique_id)
		}		
	})
	socket.on('receiver welcome', function(greeting){
		if(greeting.role == 'receiver')
		{
			
			var data_len = data.length;
			for (var i = 0; i < data_len; i++) {
				if(data[i].url_id == greeting.url_id)
				{
					data[i].receiver_socket = socket
					var rec_soc = data[i].receiver_socket
					var ini_text = data[i].initiator_text.req_str
					break
 				}  
			}
		rec_soc.emit('initiator text', ini_text)
		}
	})
	socket.on('receiver answer', function(answer){
		var data_len = data.length;
			for (var i = 0; i < data_len; i++) {
				if(data[i].url_id == answer.url_id)
				{
					data[i].receiver_text = answer.receiver_text
					var ini_soc = data[i].initiator_socket
					break
 				}  
			}
		ini_soc.emit('receiver answer', answer.receiver_text)
	})
})

app.get('/:uni_id', function(req, res){
	res.sendFile( __dirname + "/public/" + "index.html" )
})






