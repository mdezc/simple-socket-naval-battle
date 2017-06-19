var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');

app.use(serveStatic('public/'));

var player1board;
var player2board;

var player1 = { id : null, ready:null, hits:0};
var player2 = { id : null, ready:null, hits:0};

var bothPlayers = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/busy', function (req, res) {
    res.sendFile(__dirname + '/busy.html');
});


io.on('connection', function (socket) {
    socket.join('partido');
    console.log('user connected');

    var cantJugadores = io.sockets.adapter.rooms['partido'].length;
    console.log('cantJugadores ' + cantJugadores);

    if (cantJugadores === 1) {
        socket.fichas = 0;
        player1.id = socket.id;
        gameOver();
    }

    if (cantJugadores === 2) {
        socket.fichas = 0;
        player2.id = socket.id;
        prepareGame();

    }

    console.log("player 1: " + player1.id);
    console.log("player 2: " + player2.id);

    socket.on('disconnect', function () {
        if (io.sockets.adapter.rooms['partido'] != null && io.sockets.adapter.rooms['partido'].length < 2) {
            player1 = {};
            player2 = {};
            gameOver();
        }
    });

    socket.on('boat', function (id) {
        if (socket.fichas < 10) {
            socket.fichas++;
            bothPlayers[socket.id].board[id.substring(1)].tipo = "boat";
            socket.emit('boat', '#' + id);
            console.log('board BOAT on ' + id);
        }
        if (socket.fichas === 10) {
            socket.emit('donePrep');
            bothPlayers[socket.id].ready = true;
            console.log('p1 ready: ' + bothPlayers[player1.id].ready + ' id: ' + player1.id);
            console.log('p2 ready: ' + bothPlayers[player2.id].ready + ' id: ' + player2.id);
        }
        if (checkBothPlayerStatus()) {
            startShooting();
        }
    });

    socket.on('shoot', function (id) {
        socket.broadcast.emit('shoot', id);
        console.log('dispararon a: ' + id);

        console.log('le pegaron a ' + otherPlayerBoard(socket.id, id));

        socket.emit(otherPlayerBoard(socket.id, id), '#'+ id);

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
    if (typeof bothPlayers[player1.id] === 'undefined' || typeof bothPlayers[player2.id] === 'undefined') {
        console.log('check both player status: one not ready');
        return false;
    }
    if (bothPlayers[player1.id].ready && bothPlayers[player2.id].ready) {
        console.log('check both player status: both ready');
        return true;
    }
    console.log('check both player status: one not ready');
    return false;

}

function gameOver() {
    io.emit('over');
}

function prepareGame() {
    player1board = matriz();
    initBoard(player1board);
    player1.board = player1board;

    player2board = matriz();
    initBoard(player2board);
    player2.board = player2board;

    bothPlayers[player1.id] = player1;
    bothPlayers[player2.id] = player2;
    io.emit('ready');
}

function initBoard(board) {
    for (property in  board) {
        io.emit('water', '#_' + property);
        io.emit('default', '#'+ property);
    }   
}

function updateBoard(jugador) {
    for (var tile in jugador.board) {
        jugador.emit( )
    }
}

function otherPlayerBoard(playerId, cellId) {
    if (playerId === player1.id ) { return player2board[cellId].tipo }
    if (playerId === player2.id ) { return player1board[cellId].tipo }
}

function Tile(string) {
    this.tipo = "water";
    this.revealed = false;
    this.id = string;
}

function matriz() {
    var matriz = {};
    var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    for (var x = 0; x < alphabet.length ; x++) {
        for (var y = 1; y < 11; y++) {
            matriz[(alphabet[x] + y).toString()] = new Tile( (alphabet[x] + y).toString() );
        }
    }
    return matriz;
}

var startShooting = function () {
    io.emit('endPrepare');
    console.log('starting start shooting');

    var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    for (var x = 0; x < alphabet.length ; x++) {
        for (var y = 1; y < 11; y++) {
            io.in('partido').emit('unknown', '#' + (alphabet[x] + y).toString() );
        }
    }

    console.log('finish start shooting process');
};






/*

ni idea, delete

 function hideRivalBoard() {
 for (property in new Matriz()) {
 io.emit('unknown', '#' + property);
 }
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

*/