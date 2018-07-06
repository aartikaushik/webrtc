var socket = io();
var Peer = SimplePeer;

// for grabbing last unique id in the url
var lastPart = window.location.href.split("/").pop();

// receiver
if(lastPart != '')
{
	// initializing constructor for peer
	var p = new Peer({ initiator: false , trickle: false });

	// sending role and url id as greeting message to server in response to which server will send initiator text
    var greeting = {"role": 'receiver', "url_id": lastPart};
	socket.emit('receiver welcome', greeting);
	
	// initiator text from the server side is catched here
	socket.on('initiator text', function(str){	
		p.on('signal', function (data){
			//console.log('SIGNAL', JSON.stringify(data));

			//sending answer(reply) back to server
			var receiver_answer = {"role": 'receiver', "receiver_text": JSON.stringify(data), "url_id": lastPart};
			socket.emit('receiver answer', receiver_answer);
		})
		p.on('error', function (err) { console.log('error', err) });
		p.signal(JSON.parse(str));		
	})
    var link_div = document.createElement("div");
	link_div.id = 'share_url';
	document.getElementById("side_pannel").appendChild(link_div);	
}

// initiator
else
{
	//  initializing constructor
	var p = new Peer({ initiator: true , trickle: false });

	p.on('signal', function (data) {
		//console.log('SIGNAL', JSON.stringify(data));

		// sending role and request string to server
		var role_and_string = {"role": 'initiator', "req_str": JSON.stringify(data)};
		socket.emit('request string', role_and_string);

		// unique id sent by server is catched here
		socket.on('id', function(id){
		    var link_div = document.createElement("div");
		    link_div.id = 'share_url';
		    link_div.innerHTML = "Share this URL with whom you want to chat :<br> radiant-basin-26448.herokuapp.com/" + id ;
		    document.getElementById("side_pannel").appendChild(link_div);
		})   
	})
	p.on('error', function (err) { console.log('error', err) });

	// receiver answer sent by server is catched here
	socket.on('receiver answer', function(ans){
		p.signal(JSON.parse(ans));
	})
}
     
p.on('connect', function () {
	//console.log('CONNECT');
	document.getElementById("share_url").textContent = "Connected";

	// on click of send button this will execute
	document.getElementById("send").addEventListener("click", function () {
		
		if(document.getElementById('message').value != null && document.getElementById('message').value != '')
		{
			p.send(document.querySelector('#message').value);		  
			var list = document.createElement("li");
			list.id = 'list';
			var span = document.createElement("span");
			span.className = 'right';
			var new_div = document.createElement("div");
			new_div.className = 'clear';
			span.textContent = document.querySelector('#message').value;
			list.appendChild(span);
			list.appendChild(new_div); 
			document.getElementById("ulist").appendChild(list);		
			document.getElementById("message").value = '';
			var myDiv = document.getElementById("chat-window");
			myDiv.scrollTop = myDiv.scrollHeight;
		}		
	})
})

p.on('data', function (data) {

		var list = document.createElement("li");
		list.id = 'list';
		var span = document.createElement("span");
		span.className = 'left';
		var new_div = document.createElement("div");
		new_div.className = 'clear';
		span.textContent = data;
		list.appendChild(span);
		list.appendChild(new_div);
		document.getElementById("ulist").appendChild(list);
		var myDiv = document.getElementById("chat-window");
		myDiv.scrollTop = myDiv.scrollHeight;
		//console.log('data: ' + data)
})


