$(document).ready(function() {

    var socket = io();

    var esMiTurno = true;
    var ponerFichas = false;
    var fichasPuestas = 0;

    var loading = function() {
        // add the overlay with loading image to the page
        var over = '<div id="overlay">' +
            '<img id="loading" src="loader.gif">' +
            '</div>';
        $(over).appendTo('body');
    }

    $('#jugador > table > tbody > tr > td ').click(function () {
        if (ponerFichas && esMiTurno) {
            
            socket.emit('boat', $(this).attr('id'));
            console.log("populando: " + $(this).attr('id'));
        }
    });


    $('#rival > table > tbody > tr > td ').click(function () {
        if (esMiTurno && !ponerFichas) {
            socket.emit('shoot', $(this).attr('id'));
            console.log("disparando a: " + $(this).attr('id'));
             esMiTurno = !esMiTurno;
             loading();
        }
    });

    $(function () {

        socket.on('water', function(id) {
            $( id ).addClass('ownwater');
            $( id ).removeClass('default');
        });

        socket.on('boat', function(id) {
            $( id ).addClass('boat');
            $( id ).removeClass('default');
        });

        socket.on('default', function(id) {
            $( id ).addClass('default');
        });

        socket.on('unknown', function(id) {
            $( id ).addClass('unknown');
            $( id ).removeClass('default');
        });

        socket.on('ready', function() {
            $('#esperando').hide();
            $('#partido').show();
        });

        socket.on('over', function() {
            $('#partido').hide();
            $('#esperando').show();
        });

        socket.on('shoot', function(id) {
            console.log('me dispararon a: '+ id);
            $( '#_' + id ).addClass('boat');
            esMiTurno = true;
            $('#overlay').remove();
        });

        socket.on('endPrepare', function () {
            ponerFichas = false;
        });

    });


});

