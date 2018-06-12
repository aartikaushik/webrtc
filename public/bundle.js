var socket = io();
var Peer = require('simple-peer')

var lastPart = window.location.href.split("/").pop();
if(lastPart != '')
{
	var p = new Peer({ initiator: false , trickle: false })
	
}
else
{
	var p = new Peer({ initiator: true , trickle: false })
}

        
p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
    var role_and_string = {"role": 'initiator', "req_str": JSON.stringify(data)} 
    socket.emit('request string', role_and_string);
    socket.on('id', function(id){
      console.log(id);    
    });
    
})

document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})

    
p.on('connect', function () {
  console.log('CONNECT')

})

var form = document.getElementById("chat_box");
document.getElementById("sending").addEventListener("click", function () {
  p.send(document.querySelector('#type_chat').value)
  document.getElementById("type_chat").value = "";
})

p.on('data', function (data) {

  document.getElementById("show_chat").innerHTML = data
  console.log('data: ' + data)
})

