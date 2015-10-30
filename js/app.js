/* app.js file creates instances of entities and provides the game rules 
 */
window.onload = function() {
    // var NUM_ROWS = 22; // cols
    // var NUM_COLS = 19; // rows
    var COLS = 23;
    var ROWS = 19;
    

    var engine = new Engine();
    engine.load();
    
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