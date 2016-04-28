var jwt = require('jsonwebtoken');
var Promise = require('promise');

var config = require('./config');
var server_key = require('./server-key');
var Bomb  = require('./bomb');

var move = function(data) {

    var decoded = jwt.verify(data.token, server_key);
    global.io.in(decoded.room).emit('move', "Moveu");
    console.log(global.getRoom(decoded.room));

};

var placeBomb = function(data) {

    var decoded = jwt.verify(data.token, server_key);
    if(this.bombs.length < this.qtdBombs) {
        var bomb = new Bomb(decoded.room,{});

        bomb.then(function(res){
            console.log(res);
        });
    }

};

var Player = function(_position, _token) {

        return {
            // Token de acesso.
            token: _token,
            // Define a posição atual do jogador
            position: _position,
            // Quantidade de bombas
            qtdBombs: 1,
            // Lista de bombas ativas
            bombs: [],

           

            init: function(socket) {
                var that = this;
                var decoded = jwt.verify(this.token, server_key);
                socket.join(decoded.room);

                socket.emit('token', this.token);

                socket.on('move', function(data){
                    move.call(that, data);
                });
                socket.on('placeBomb', function(data){
                    placeBomb.call(that, data);
                });
            }
        }

}

module.exports = Player;