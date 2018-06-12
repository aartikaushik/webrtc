var socket = io();
var Peer = require('simple-peer')
var p = new Peer({ initiator: location.hash === '#1', trickle: false })

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
   
    socket.emit('chat message', JSON.stringify(data));
    socket.on('id', function(id){
      console.log(id);    
    });
    
})
answer(ev);
function answer(ev) {
socket.on('req_str', function(req_str){
      console.log(req_str);
    });
  ev.preventDefault()
  p.signal(JSON.parse(req_str))
}

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

