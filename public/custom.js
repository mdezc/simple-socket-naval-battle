$(document).ready(function() {

    var socket = io();

    var esMiTurno = true;

    $(' td ').click(function () {
        if (esMiTurno) {
            socket.emit('shoot', $(this).attr('id'));
            console.log("disparando a: " + $(this).attr('id'));
             esMiTurno = !esMiTurno;
        }
    });

    $(function () {

        socket.on('redirect', function(destination) {
            window.location.href = destination;
        });

        //gameModes

        socket.on('water', function(id) {
            $( id ).addClass('water');
            $( id ).removeClass('default');
        });

        socket.on('boat', function(id) {
            $( id ).addClass('boat');
            $( id ).removeClass('default');
        });

        socket.on('unknown', function(id) {
            $( id ).addClass('unknown');
            $( id ).removeClass('default');
        });

        socket.on('ready', function() {
            $('#alone').hide();
            $('#enemigo').show();
        });

        socket.on('over', function() {
            $('#alone').show();
            $('#enemigo').hide();
        });

        socket.on('shoot', function(id) {
            console.log('me dispararon a: '+ id);
            $( '#x' + id ).addClass('boat');
            esMiTurno = true;
        });

    });

});

