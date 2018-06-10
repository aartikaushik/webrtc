var socket = io.connect('http://localhost:5000');
    socket.emit('chat message', "hello");
    socket.on('id', function(id){
      console.log(id);    
    });

