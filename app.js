var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');

app.use(serveStatic('public/'));

var player1board;
var player2board;

var player1fichas;
var player2fichas;

var player1 = { id : null, ready:null};
var player2 = { id : null, ready:null};

var bothPlayers = {};

var jugadores;

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
        socket.fichas = 0;
        player1.id = socket.id;
        gameOver();
    }

    if (jugadores === 2) {
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

function initBoard(board) {
    for (property in  board) {
        io.emit('water', '#_' + property);
        io.emit('default', '#'+ property);
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

function otherPlayer(socket) {
    if (player1 === socket ) { return player2 }
    if (player2 === socket ) { return player1 }
    return null;
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