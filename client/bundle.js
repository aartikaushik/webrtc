var Peer = require('simple-peer')
var p = new Peer({ initiator: location.hash === '#1', trickle: false })

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
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
