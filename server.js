var http = require('http');
var md5  = require('MD5');

httpServer = http.createServer(function(req, res){
    res.end('Hello world');
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = {};
io.sockets.on('connection', function(socket){
   var me = false ;
    
   for (var k in users){
       socket.emit('newuser', users[k])
   }
   
   //Receive msg
    socket.on('newmsg', function(message){
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        io.sockets.emit('newmsg', message);
    }); 
   
   socket.on('login', function(user){
       console.log(user);
       me = user;
       me.id = user.login;
       me.avatar = 'https://gravatar.com/avatar/' + md5(user.login) + '?s=50';
       socket.emit('logged');
       users[me.id]= me;
       io.sockets.emit('newuser', me);
       //socket.broadcast.emit('newuser'); Tous les autres utilisateurs
   });
   

    socket.on('disconnect', function(){
        if (!me){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disUser', me);
    });

});

