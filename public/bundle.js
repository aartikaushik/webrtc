var socket = io();



    socket.emit('chat message', "hello");
    socket.on('id', function(id){
      console.log(id);    
    });

