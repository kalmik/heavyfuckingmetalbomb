/*GLOBAL SCOPE*/
    global.io = null;

    global.getRoom = function(id){
        return rooms[id];
    }
/*END GLOBAL SCOPE*/

var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

//Global communicator;
global. io = require('socket.io')(http);

var jwt = require('jsonwebtoken');

var server_key = require('./server-key');

//Class Player
var Player = require('./player');

//Class Room
var Room = require('./room');

//Coleção de players
var players = {};
//Coleção de salas
var rooms  = {};


//Alocar novo player em uma sala
var newPlayer = function(socket) {

    //Lista de possíveis salas disponíveis
    var anyRoom = Object.keys(rooms).filter(function(el, i, arr) {
        return rooms[arr[i]].players < 4;
    });

    //Se existir alguma sals
    if(anyRoom.length)
        anyRoom = rooms[anyRoom[0]];
    else //Criando uma nova sala
        anyRoom = new Room();

    // Armazenando sala.
    rooms[anyRoom.id] = anyRoom;

    // Disponibilizando um token para comunicação segura, esse token será o id o usuário
    var token = jwt.sign({ room: anyRoom.id }, server_key);

    // Instanciando um novo jogador
    var player = new Player({x: 0, y:0}, token);

    // Armazenando jogadores
    players[token] = player;

    // Cadastrando um jogador na sala
    anyRoom.addPlayer();

    // Inicializando eventos de sockets/
    player.init(socket);

}

io.on('connection', function(socket){

    var clientIp = socket.request.connection.remoteAddress;
    newPlayer(socket);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});