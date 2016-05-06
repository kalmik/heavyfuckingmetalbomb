document.addEventListener('DOMContentLoaded', function () {
  var Q = Quintus().include("Sprites, Anim, Scenes, Input, 2D").setup({
    width: 480,
    height: 480
  }).controls(true);

  Q.gravityX = 0;
  Q.gravityY = 0;

  //values for collision detection
  var SPRITE_NONE = 0;
  var SPRITE_RACER = 1;
  var SPRITE_OTHER = 2;

  Q.tilePos = function(col, row) {
    return {x: col*32 + 16, y: row*32 + 16};
  };

  Q.Sprite.extend("Bat", {
    init: function (p) {
      this._super(p, {
        sheet: "bat",
        sprite: "bat",
        collisionMask: SPRITE_OTHER
      });

      Q.input.on('keydown', this, function (key) {
          if (key == 38) {
            this.play('move_up');
            this.p.vx = 0;
            this.p.vy = 1 * -100;
          }

          if (key == 39) {
            this.play('move_right');
            this.p.vx = 1 * 100;
            this.p.vy = 0;
          };

          if (key == 40) {
            this.play('move_down');
            this.p.vx = 0;
            this.p.vy = 1 * 100;
          };

          if (key == 37) {
            this.play('move_left');
            this.p.vx = 1 * -100;
            this.p.vy = 0;
          };
      });

      Q.input.on('keyup', this, function (key) {
          this.play('move_down');
          this.p.vx = 0;
          this.p.vy = 0;
      });

      Q.input.on('fire', this, 'fireWeapon');

      this.add("animation, 2d");
      this.play("move_down");
    },

    step: function (dt) {
      //
    },

    fireWeapon: function () {
      console.log('Pew!');
    }
  });

  Q.scene("level1", function (stage) {
    stage.insert(new Q.TileLayer({dataAsset: 'level_background.json', sheet: 'tiles', type: SPRITE_NONE}));
    stage.collisionLayer(new Q.TileLayer({dataAsset: 'level_collision.json', sheet: 'tiles', type: SPRITE_OTHER}));
    stage.insert(new Q.Bat(Q.tilePos(7, 7)));
  });

  Q.load("sprites.png, sprites.json, tiles.png, level_background.json, level_collision.json", function () {
    Q.sheet('tiles', 'tiles.png', {tilew: 32, tileh: 32});
    Q.compileSheets("sprites.png", "sprites.json");

    Q.animations("bat", {
      move_up:    {frames: [8,9,10,11], rate: 1/5},
      move_right: {frames: [4,5,6,7], rate: 1/5},
      move_down:  {frames: [0,1,2,3], rate: 1/5},
      move_left:  {frames: [12,13,14,15], rate: 1/5}
    });

    Q.stageScene("level1");
  });

});
