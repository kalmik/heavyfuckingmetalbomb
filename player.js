var jwt = require('jsonwebtoken');
var Promise = require('promise');

var config = require('./config');
var server_key = require('./server-key');
var Bomb  = require('./bomb');

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

            move: function(data) {

                var decoded = jwt.verify(data.token, server_key);
                global.io.in(decoded.room).emit('move', "Moveu");
                console.log(global.getRoom(decoded.room));

            },

            placeBomb: function(data) {

                var decoded = jwt.verify(data.token, server_key);
                //if(bombs.length < qtdBombs) {
                    var bomb = new Bomb(decoded.room,{});

                    bomb.then(function(res){
                        console.log(res);
                    });
                //}

            },

            init: function(socket) {
                var decoded = jwt.verify(this.token, server_key);
                socket.join(decoded.room);

                socket.emit('token', this.token);

                socket.on('move', this.move);
                socket.on('placeBomb', this.placeBomb);
            }
        }

}

module.exports = Player;