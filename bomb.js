var config = require('./config');
var Promise = require('promise');

var Bomb = function(room, pos) {

    var promise = new Promise(function (resolve, reject){

        console.log("Booooommmm");
        var explode = function() {
            global.io.in(room).emit("boom", pos);
            resolve("Boom");
        }

        setTimeout(explode, 3*1000);

    });
    global.io.in(room).emit('newBomb', "Cagou");

    return promise;
};

module.exports = Bomb