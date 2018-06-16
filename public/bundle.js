var socket = io()
var Peer = require('simple-peer')

var lastPart = window.location.href.split("/").pop()
if(lastPart != '')
{
	var p = new Peer({ initiator: false , trickle: false})
        var greeting = {"role": 'receiver', "url_id": lastPart} 
        socket.emit('receiver welcome', greeting)
	socket.on('initiator text', function(str){
      			
		p.on('signal', function (data) {
			console.log('SIGNAL', JSON.stringify(data))
			var receiver_answer = {"role": 'receiver', "receiver_text": JSON.stringify(data), "url_id": lastPart} 
			socket.emit('receiver answer', receiver_answer)
		})
		p.on('error', function (err) { console.log('error', err) })
		p.signal(JSON.parse(str))		
	})
	
}
else
{
	var p = new Peer({ initiator: true , trickle: false })
	p.on('signal', function (data) {
		console.log('SIGNAL', JSON.stringify(data))
		var role_and_string = {"role": 'initiator', "req_str": JSON.stringify(data)} 
		socket.emit('request string', role_and_string)
		socket.on('id', function(id){
			console.log(id)    
		})
    
	})
	p.on('error', function (err) { console.log('error', err) })
	socket.on('receiver answer', function(ans){
		p.signal(JSON.parse(ans))
	})
}
     
p.on('connect', function () {
  console.log('CONNECT')
  document.getElementById("send").addEventListener("click", function () {
  p.send(document.querySelector('#message').value)
  document.getElementById("message").value = "";
})
})

p.on('data', function (data) {
  console.log('data: ' + data)
})
