var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');

app.use(serveStatic('public/'));

var jugadores = [];
var cantidadDeJugadores;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    console.log('User connected');

    if (jugadores.length < 2) {
        console.log('Agregando jugador al partido: ' + socket.id);
        socket.join('partido');
        cantidadDeJugadores = io.sockets.adapter.rooms['partido'].length;
        console.log('Jugadores en partido: ' + cantidadDeJugadores);
        var jugador = new Jugador();
        jugador.id = socket.id;
        jugadores.push(jugador);
        gameOver();
    }

    if (jugadores.length === 2) {
        socket.fichas = 0;
        player2.id = socket.id;
        prepareGame();

    }

    console.log("player 1: " + player1.id);
    console.log("player 2: " + player2.id);

    socket.on('disconnect', function () {
        if (io.sockets.adapter.rooms['partido'] !== null && io.sockets.adapter.rooms['partido'].length < 2) {
            jugadores = [];
            gameOver();
        }
    });

    socket.on('boat', function (id) {
        if (socket.fichas < 10) {
            socket.fichas++;
            player1board[id] = {class:"boat", revealed:false};
            socket.emit('boat', '#' + id);
        } else {
            console.log('p1: ' + player1.id);
            console.log('p2: ' + player2.id);
            bothPlayers[socket.id] = {ready:true};
            if (checkBothPlayerStatus()) {
                io.emit('endPrepare');
            }
        }
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

function checkBothPlayerStatus() {
    for (var i = 0; i < bothPlayers.length; i++) {
        if ( checkBothPlayerStatus[player1.id]) {
            
        }
    }

   if (typeof checkBothPlayerStatus[player1.id] === 'undefined' || typeof checkBothPlayerStatus[player1.id] === 'undefined') {
        console.log('check both player status: one not ready');
        return false;
   } else {
    console.log('check both player status: both ready');
   return checkBothPlayerStatus[player1.id].ready && checkBothPlayerStatus[player2.id].ready;
   }
}

function gameOver() {
    io.emit('over');
}

function prepareGame() {
    player1board = new Matriz;
    player2board = new Matriz;
    initBoard(player1board);
    initBoard(player2board);
    io.emit('ready');
}

function readBoard(board) {
    for (property in  board) {
        socket.send('water', '#_' + property);
        socket.send('default', '#'+ property);
    }   
}

function hideRivalBoard() {
    for (property in new Matriz()) {
        io.emit('unknown', '#' + property);
    }
}

function Tile() {
    this.class = "water";
    this.revealed = false;
}

function Matriz() {
    var matriz = {};
    var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    for (var x = 0; x < alphabet.length ; x++) {
        for (var y = 1; y < 11; y++) {
            this[(alphabet[x] + y).toString()] = new Tile();
        }
    }
}

function Jugador() {
    this.id = null;
    this.ready = null;
    this.fichas = 0;
    this.ownBoard = new Matriz();
    this.rivalBoard = new Matriz();
}


function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}