var uuid = require('node-uuid');

var Room = function() {
  return {

	  id: uuid.v1(),
	  players: 0,

	  addPlayer: function() {
	    return ++this.players;
	  }

  }

}

module.exports = Room;