var socket = io()
var Peer = require('simple-peer')
var lastPart = window.location.href.split("/").pop()
if(lastPart != '')
{
	var p = new Peer({ initiator: false , trickle: false })
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
		    var text_div = document.createElement("div")
		    text_div.className = 'share_url'
		    text_div.innerHTML = "Share this URL with whom you want to chat : localhost:5000/" + id 
		    document.getElementById("fullpage").appendChild(text_div) 
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
		var list = document.createElement("li")
		list.id = 'list'
		var span = document.createElement("span")
		span.className = 'right'
		var new_div = document.createElement("div")
		new_div.className = 'clear'
		span.textContent = document.querySelector('#message').value 
		document.getElementById("ulist").appendChild(list)
		document.getElementById("list").appendChild(span)
		document.getElementById("list").appendChild(new_div)
		document.getElementById("message").value = ""
	})
})

p.on('data', function (data) {
	var list = document.createElement("li")
	list.id = 'list'
	var span = document.createElement("span")
	span.className = 'left'
	var new_div = document.createElement("div")
	new_div.className = 'clear'
	span.innerHTML = data
	document.getElementById("ulist").appendChild(list)
	document.getElementById("list").appendChild(span)
	document.getElementById("list").appendChild(new_div)
	console.log('data: ' + data)
})


