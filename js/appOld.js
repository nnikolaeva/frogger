window.onload = function() {
  var numRows = 6;
  var numCols = 5;
  var engine = new Engine();
  setUpEntities();
  engine.load();
  function resetGame() {
    engine.clearGameBoard();
    engine.deleteBackgroundEntities();
    engine.deleteEntities();
    engine.deleteSubscriptions();
    setUpEntities();
  }
  function onCollision() {
    alert("GAME OVER");
    resetGame();
  }
  function onWin() {
    engine.deleteSubscriptions();
    setTimeout(function() {
      alert("YOU WIN!");
      resetGame();
    }, 100);
  }
  // function draws foreground entities
  function setUpEntities() {
    // add background entities
    for (var row = 0; row < numRows; row++) {
      for (var col = 0; col < numCols; col++) {
        if (row === 0) {
          engine.addBackgroundEntity(new WaterBlock(col, row));
        } else if (row > 0 && row <= 3) {
          engine.addBackgroundEntity(new StoneBlock(col, row));
        } else if (row > 3) {
          engine.addBackgroundEntity(new GrassBlock(col, row));
        }
      }
    }
    // add foreground entities
    var player = new Player(2, 5);
    engine.addEntity(player);
    var speed;
    var delay = 0;
    for (var i = 0; i < 9; i++) {
      speed = Math.random() * 2 + 2;
      engine.addEntity(new Enemy(-1, i % 3 + 1, speed, delay, numCols));
      delay = Math.random() * 4 + 1;
    }
    document.addEventListener('keyup', function(e) {
      var allowedKeys = {
        37 : 'left',
        38 : 'up',
        39 : 'right',
        40 : 'down'
      };
      player.handleInput(allowedKeys[e.keyCode], numRows, numCols);
    });
    engine
        .addSubscribtion(new Subscribtion(player, [ Enemy ],
            onCollision));
    engine.addSubscribtion(new Subscribtion(player, [ WaterBlock ], onWin));
  }
}
