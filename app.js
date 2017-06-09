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


//INIT
io.on('connection', function (socket) {

    console.log('User connected');

    //PLAYER1
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

    //PLAYER2
    if (jugadores.length === 2) {
        socket.fichas = 0;
        jugador.id = socket.id;
        jugadores.push(jugador);
        prepareGame();
    }

    console.log("player 1: " + jugadores[0]);
    console.log("player 2: " + jugadores[1]);

    //DISCONNECT
    socket.on('disconnect', function () {
        if (typeof io.sockets.adapter.rooms['partido'] !== 'undefined' && io.sockets.adapter.rooms['partido'].length < 2) {
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
    for (var i = 0; i < jugadores.length; i++) {
        if ( checkBothPlayerStatus[jugadores[i].id]) {
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

function Tile(xy) {
    this.class = "water";
    this.revealed = false;
    this.coords = xy;
}

function prepareGame() {
    for (var jugador in jugadores) {
        jugador = new Jugador();
        for (tile in jugador.ownBoard) {
            socket.to(jugador.id).emit(Tile[property], Tile.);
        }
    }
    io.emit('populate');

}

function readBoard(board) {
    for (property in  board) {
        socket.send('water', '#_' + property);
        socket.send('default', '#'+ property);
    }   
}

//delete??
function hideRivalBoard() {
    for (property in new Matriz()) {
        io.emit('unknown', '#' + property);
    }
}


function Matriz() {
    var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    for (var x = 0; x < alphabet.length ; x++) {
        for (var y = 1; y < 11; y++) {
            this[(alphabet[x] + y).toString()] = new Tile((alphabet[x] + y).toString());
        }
    }
    console.log("matriz looks like: ");
    console.log(this);
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