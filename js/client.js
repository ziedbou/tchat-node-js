(function ($) {

    var socket = io.connect('http://localhost:1337');
    var template = $('.ctn-msg').html();
    $('.ctn-msg').remove();
    
    $('#form').on('submit', function (e) {
        e.preventDefault();
        socket.emit('login', {
            login: $('#login').val(),
            pass: $('#password').val()
        });
        
        $('#users, .form-message, #messages').removeClass('display');
        $('#form-connect').fadeOut();
    });

    //Logged
    socket.on('logged', function () {
        $('#form-connect').fadeOut();
    });

    //New User
    socket.on('newuser', function (user) {
        $('#toClone').clone().appendTo('#users').attr('id', user.id);
        $('#' + user.id  + ' img').attr('src', user.avatar);
        $('#' + user.id+' h4').text(user.login);
        $('#' + user.id ).fadeIn();
    });


    //Disconnect
    socket.on('disUser', function (user) {
        $('#'+user.id).remove();
    });
    
    
    //Send Messge 
    $('.form-message').on('submit', function(e){
        e.preventDefault();
        var message = {};
        message.msg = $('#message-text').val();
        socket.emit('newmsg', message);
        $('#message-text').val('');
        $('#message-text').focus();
    });
    
    socket.on('newmsg', function (message) {
        var rendred = Mustache.render(template, message);
        $('#messages').append(rendred);
    });
    
})(jQuery);