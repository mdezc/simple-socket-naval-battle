var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');

app.use(serveStatic('public/'));

var player1;
var player2;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/busy', function (req, res) {
    res.sendFile(__dirname + '/busy.html');
});


io.on('connection', function (socket) {
    socket.join('partido');

    console.log('user connected');

    var jugadores = io.sockets.adapter.rooms['partido'].length;
    console.log('jugadores ' + jugadores);

    if (jugadores === 1) {
        player1 = socket;
        gameOver();
    }

    if (jugadores === 2) {
        player2 = socket;

        prepareGame();

    }

    console.log("player 1: " + player1);
    console.log("player 2: " + player2);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        player1 = undefined;
        player2 = undefined;
    });

    socket.on('boat', function (id) {
        io.emit('boat', '#' + id);
    });

    socket.on('shoot', function (id) {
        socket.broadcast.emit('shoot', id);
        console.log('dispararon a: ' + id);

    });

    socket.on('changeSides', function () {
        socket.broadcast.emit('changeSides');
        console.log('cambiando de lado');
    });

});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

function gameOver() {
    io.emit('over');
}

function prepareGame() {
    fillBoats();
    io.emit('ready');
}

function fillBoats() {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (var x = 0; x < alphabet.length ; x++) {
        for (var y = 0; y < 11; y++) {
            var id = alphabet[x] + y;
            io.emit('water', '#x' + id);
            io.emit('unknown', '#'+id);
        }
    }
}
