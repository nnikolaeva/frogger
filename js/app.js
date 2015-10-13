/* app.js file creates instances of entities and provides the game rules 
 */
window.onload = function() {
    var player;
    var NUM_ROWS = 16; //6;
    var NUM_COLS = 19; //5;
    var LIFE_NUMBER = 3;
    var engine = new Engine();
    engine.load();
    setUpEntities();
    document.addEventListener('keyup', function(e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            player.handleInput(allowedKeys[e.keyCode], NUM_ROWS, NUM_COLS);
        });

    function resetGame() {
        engine.clearGameBoard();
        engine.deleteBackgroundEntities();
        engine.deleteEntities();
        engine.deleteInfoEntities();
        engine.deleteSubscriptions();
        setUpEntities();
        setUpPlayerInfoPanel();
    }

    function resetLevel() {

        engine.clearGameBoard();
        setUpPlayerInfoPanel();
        player.changePositionToInitial();
    }

    function onCollision() {
        if (player.numberOfLifes > 1) {
            player.numberOfLifes--;
            resetLevel();
            setUpPlayerInfoPanel();
            console.log("on");
        } else {
            resetGame();
            
        }
        
    }

    function onWin() {
        engine.deleteSubscriptions();
        setTimeout(function() {
            alert("YOU WIN!");
            resetGame();
        }, 100);
    }
    function setUpPlayerInfoPanel() {
        engine.deleteInfoEntities();
        var lifes = engine.getPlayerLifeNumber();
        for (var i = 0; i < player.numberOfLifes; i++) {
            engine.addInfoEntity(new Lifes(i, NUM_ROWS));
        }
    }

    function setUpEntities() {
        //add background entities
        for (var col = 0; col < NUM_COLS; col++) {
            for (var row = 0; row < NUM_ROWS - 1; row++) {
                if ((row === 0 && col % 2 === 0) || (row === 7) || (row === 14)) {
                    engine.addBackgroundEntity(new GrassBlock(col, row));
                    if (col === 4 && row === 0) {
                    engine.addBackgroundEntity(new SelectorBlock(col, row));
                    }

                } else if ((row === 0 && col % 2 !== 0) || (row > 0 && row < 7)) {
                    engine.addBackgroundEntity(new WaterBlock(col, row));
                } else {
                    engine.addBackgroundEntity(new StoneBlock(col, row));
                }
            }
        }

        // add foreground entities
        player = new Player(9, 14, LIFE_NUMBER);
        setUpPlayerInfoPanel();

        engine.addEntity(player);
        var speed;
        var delay = 0;
        for (var i = 0; i < 12; i++) {
            speed = Math.random() * 2 + 2;
            engine.addEntity(new Enemy(-1, i % 6 + 8, speed, delay, NUM_COLS));
            engine.addEntity(new Mover(-1, i % 6 + 2, speed, delay, NUM_COLS));
            delay = Math.random() * 4 + 1;
        }
        engine
            .addSubscribtion(new Subscribtion(player, [Enemy],
                onCollision));
        // engine.addSubscribtion(new Subscribtion(player, [WaterBlock], onWin));
    }
};