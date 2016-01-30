/* app.js file creates instances of entities and provides the game rules 
 */
window.onload = function() {
    var gridWidth = 40;
    var gridHeight = 33;

    var COLS = 23;
    var ROWS = 19;

    var engine = new Engine(gridWidth, gridHeight, COLS, ROWS + 2);

    function loadResources(engine) {
        Resources.load([
            'images/char-boy.png',
            'images/enemy-bug.png',
            "images/enemy-bug_flipped.png",
            'images/gem-blue.png',
            'images/gem-green.png',
            'images/gem-orange.png',
            'images/grass-block.png',
            'images/heart.png',
            'images/key.png',
            'images/lock.png',
            'images/log.png',
            'images/stone-block.png',
            'images/water-block.png',
        ]);
        engine.lastTime = Date.now();
        Resources.onReady(engine.start.bind(engine));
    }

    loadResources(engine);

    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            13: 'enter',
            27: 'esc'
        };
        engine.handleUserInput(allowedKeys[e.keyCode], COLS, ROWS);
    });

    var menuController = new MenuController(engine, COLS, ROWS);
    menuController.openStartMenu();
};