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
        var text_div = document.createElement("div")
	text_div.className = 'share_url'
	text_div.id = 'share_url'
	document.getElementById("side_pannel").appendChild(text_div)	
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
		    text_div.id = 'share_url'
		    text_div.textContent = "Share this URL with whom you want to chat : radiant-basin-26448.herokuapp.com/" + id 
		    document.getElementById("side_pannel").appendChild(text_div) 
		})   
	})
	p.on('error', function (err) { console.log('error', err) })
	socket.on('receiver answer', function(ans){
		p.signal(JSON.parse(ans))
	})
}
     
p.on('connect', function () {
	console.log('CONNECT')
	document.getElementById("share_url").textContent = "Connected"
	document.getElementById("send").addEventListener("click", function () {
		if((document.getElementById('message').value == null || document.getElementById('message').value == '') && document.getElementById('pic').value == '')
		{
			var data_and_type = {"type": 'blank' , "info": ''}	
		}
		else if((document.getElementById('message').value != null || document.getElementById('message').value != '') && document.getElementById('pic').value == '')
		{
			var data_and_type = {"type": 'text' , "info": document.querySelector('#message').value}
			p.send(JSON.stringify(data_and_type))		  
			var list = document.createElement("li")
			list.id = 'list'
			var span = document.createElement("span")
			span.className = 'right'
			var new_div = document.createElement("div")
			new_div.className = 'clear'
			span.textContent = document.querySelector('#message').value
			list.appendChild(span) 
			list.appendChild(new_div) 
			document.getElementById("ulist").appendChild(list)		
			document.getElementById("message").value = ''
		}
		if(document.getElementById('pic').value != '')
		{	
			var data_and_type = {"type": 'image' , "info": document.getElementById("base64_string").value } 
			p.send(JSON.stringify(data_and_type))
			var list = document.createElement("li")
			list.id = 'list'
			var span = document.createElement("span")
			span.className = 'right'
			var image = document.createElement("img")
			image.src = data_and_type.info
			var new_div = document.createElement("div")
			new_div.className = 'clear'
			span.appendChild(image) 
			list.appendChild(span) 
			list.appendChild(new_div)
			document.getElementById("ulist").appendChild(list)		
			document.getElementById("pic").value = ''
	
		}
			
	})
//yaha lagana h })

p.on('data', function (data) {
	var obj = JSON.parse(data)
	if(obj.type == 'text')
	{
		var list = document.createElement("li")
		list.id = 'list'
		var span = document.createElement("span")
		span.className = 'left'
		var new_div = document.createElement("div")
		new_div.className = 'clear'
		span.textContent = obj.info
		list.appendChild(span) 
		list.appendChild(new_div)
		document.getElementById("ulist").appendChild(list)
		console.log('data: ' + data)
	}
	else if(obj.type == 'image')
	{
		console.log(obj)
		var list = document.createElement("li")
		list.id = 'list'
		var span = document.createElement("span")
		span.className = 'left'
		var image = document.createElement("img")
		image.src = obj.info
		var new_div = document.createElement("div")
		new_div.className = 'clear'
		span.appendChild(image) 
		list.appendChild(span) 
		list.appendChild(new_div)
		document.getElementById("ulist").appendChild(list)
		
	}
})


