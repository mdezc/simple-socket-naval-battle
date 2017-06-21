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
            $(this).removeClass('ownwater');
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
            $( id ).removeClass('unknown');
        });

        socket.on('boat', function(id) {
            $( id ).addClass('boat');
            $( id ).removeClass('default');
            $( id ).removeClass('unknown');
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
            ponerFichas = true;
        });

        socket.on('donePrep', function() {
            ponerFichas = false;
            console.log('donePrep over for me');
            $('.ownwater').hover(function() {
                $(this).css("cursor","default")
            });
        });

        socket.on('over', function() {
            $('#partido').hide();
            $('#esperando').show();
        });

        socket.on('winner', function() {
            $('#partido').hide();
            $('#winner').show();
            $('#overlay').remove();
        });

        socket.on('loser', function() {
            $('#partido').hide();
            $('#loser').show();
            $('#overlay').remove();
        });

        socket.on('shoot', function(id) {
            console.log('me dispararon a: '+ id);
            if ($( '#_' + id ).hasClass('boat')) {
                $( '#_' + id ).removeClass('boat');
                $( '#_' + id ).addClass('boat-hit');
            }
            if ($( '#_' + id ).hasClass('ownwater')) {
                $( '#_' + id ).removeClass('ownwater');
                $( '#_' + id ).addClass('water-hit');
            }
            esMiTurno = true;
            $('#overlay').remove();
        });

        socket.on('endPrepare', function () {
            console.log('endPrepare');
            ponerFichas = false;
        });

    });


});

