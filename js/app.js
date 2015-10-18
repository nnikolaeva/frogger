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
    console.log(engine.layers);
    document.addEventListener('keyup', function(e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',
                13: 'enter'
            };
            engine.handleUserInput(allowedKeys[e.keyCode], NUM_ROWS, NUM_COLS);
            //player.handleInput(allowedKeys[e.keyCode], NUM_ROWS, NUM_COLS);
        });

    function resetGame() {
        engine.clearGameBoard();
        engine.deleteLayers();
        // engine.deleteBackgroundEntities();
        // engine.deleteEntities();
        //engine.deleteInfoEntities();
        engine.deleteSubscriptions();
        engine.deleteUserInputSubscriptions();
        setUpEntities();
        // addGameOverLayer();
        engine.addEntityToLayer(new RectangleEntity(0, 0, NUM_COLS, 8), 2);
        engine.addEntityToLayer(new TextEntity(4, 4, "Game Over", "#009900", "bold 150px Gloria Hallelujah"), 2);

        // var gameOverRect = new RectangleEntity(0, 0, 2, 2);
        // gameOverRect.color = "white";
        // engine.addEntityToLayer(gameOverRect, 2);
    }

    function resetLevel() {

        //engine.clearGameBoard();
        //setUpPlayerInfoPanel();
        player.changePositionToInitial();
        engine.changeLifeIconVisibility();


    }

    function onCollision() {
        console.log("in onCollision");

        if (player.numberOfLifes > 1) {
            player.numberOfLifes--;
            resetLevel();
        } else {
            resetGame();
            
        }
        
    }

    function onWin() {
        // engine.deleteSubscriptions();
        // setTimeout(function() {
        //     alert("YOU WIN!");
        //     resetGame();
        // }, 100);
    resetGame();
    // var gameWinRect = new RectangleEntity(0, 0, 2, 2);
    //     gameWinRect.color = "green";
    //     engine.addEntityToLayer(gameWinRect, 2);
    engine.addEntityToLayer(new RectangleEntity(0, 0, NUM_COLS, 8), 2);
    engine.addEntityToLayer(new TextEntity(4, 4, "Congrats!", "#009900", "bold 150px Gloria Hallelujah"), 2);
    }

    function addGameOverLayer() {
        // Change name and use without arrays
        var newLayerArray = [];
        var gameOverMenu = new Menu(0, 0, NUM_COLS, NUM_ROWS);
        var continueButton = new Button(3, 3, 6, 2, "continue");
        //continueButton.addOnClickHandler(removeMenu1);
        //exp
        continueButton.onClick = function() {
            console.log(continueButton.name);
            engine.deleteUpperLayer();
        };
        gameOverMenu.addButton(continueButton);

        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", Menu, gameOverMenu.handleEnterInput.bind(gameOverMenu)));
        newLayerArray.push(gameOverMenu);
        engine.addLayer(newLayerArray);
        console.log(engine.layers);



    }
    // function setUpPlayerInfoPanel() {
    //     engine.deleteInfoEntities();
    //     var lifes = engine.getPlayerLifeNumber();
    //     for (var i = 0; i < player.numberOfLifes; i++) {
    //         engine.addInfoEntity(new Life(i, NUM_ROWS));
    //     }
    // }
     function removeMenu() {
            engine.deleteUpperLayer();
            console.log("removeMenu");
            console.log(engine.layers);

        }
    function removeMenu1() {
        engine.deleteUpperLayer();
            console.log("removeMenu1");
            console.log(engine.layers);
    }
        function configButtonClick() {
            console.log("configButton clicked!");
        }
    function setUpEntities() {
        var background = [];
        for (var col = 0; col < NUM_COLS; col++) {
            for (var row = 0; row < NUM_ROWS - 1; row++) {
                if ((row === 0 && col % 2 === 0) || (row === 7) || (row === 14)) {
                    background.push(new GrassBlock(col, row));
                    if (col === 4 && row === 0) {
                    background.push(new SelectorBlock(col, row));
                    }

                } else if ((row === 0 && col % 2 !== 0) || (row > 0 && row < 7)) {
                    background.push(new WaterBlock(col, row));
                } else {
                    background.push(new StoneBlock(col, row));
                }
            }
        }
        engine.addLayer(background);

        var foreground = [];
        player = new Player(9, 14, LIFE_NUMBER);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", Player, player.moveUp.bind(player)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", Player, player.moveDown.bind(player)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("left", Player, player.moveLeft.bind(player)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("right", Player, player.moveRight.bind(player)));
        foreground.push(player);

        var speed;
        var delay = 0;
        for (var i = 0; i < 12; i++) {
            speed = Math.random() * 2 + 2;
            foreground.push(new Enemy(-1, i % 6 + 8, speed, delay, NUM_COLS));
            foreground.push(new Mover(-1, i % 6 + 2, speed, delay, NUM_COLS));
            delay = Math.random() * 4 + 1;
         }

        engine.addLayer(foreground);
        var menuArray = [];
        

       

        var menu = new Menu(0, 0, NUM_COLS, NUM_ROWS);
        //var startButton = new Button(7, 7, 6, 1.5, "-> start");
        var startButton = new Button(7, 9, "start");
        //startButton.addOnClickHandler(removeMenu);
        //exp
        startButton.onClick = function () {
            console.log(startButton.name);
            engine.deleteUpperLayer();
        }
        menu.addButton(startButton);
        //var configButton = new Button(7, 10, 6, 2, "configs");
        var configButton = new Button(7, 11, "configs");
        menu.addButton(configButton);
        configButton.onClick = function() {
            console.log("configButton");
        };
        //engine.addUserInputSubscribtion(new UserInputSubscribtion(Menu, menu.handleEnterInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", Menu, menu.handleEnterInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", Menu, menu.handleUpInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", Menu, menu.handleDownInput.bind(menu)));

        menuArray.push(menu);

        menuArray.push(new TextEntity(4, 4, "Frogger", "#009900", "bold 150px Gloria Hallelujah"));
        // var startButton = new Button();
        // startButton.addOnclickHandler(onClick);
        // menu.addButton(startButton);

        // TODO: create eventsubscription


       engine.addLayer(menuArray);
        
        



       //  //add background entities
       //  for (var col = 0; col < NUM_COLS; col++) {
       //      for (var row = 0; row < NUM_ROWS - 1; row++) {
       //          if ((row === 0 && col % 2 === 0) || (row === 7) || (row === 14)) {
       //              engine.addBackgroundEntity(new GrassBlock(col, row));
       //              if (col === 4 && row === 0) {
       //              engine.addBackgroundEntity(new SelectorBlock(col, row));
       //              }

       //          } else if ((row === 0 && col % 2 !== 0) || (row > 0 && row < 7)) {
       //              engine.addBackgroundEntity(new WaterBlock(col, row));
       //          } else {
       //              engine.addBackgroundEntity(new StoneBlock(col, row));
       //          }
       //      }
       //  }

       //  // add foreground entities
       //  player = new Player(9, 14, LIFE_NUMBER);
       //  //setUpPlayerInfoPanel();

       //  engine.addEntity(player);
       //  var speed;
       //  var delay = 0;
       //  for (var i = 0; i < 12; i++) {
       //      speed = Math.random() * 2 + 2;
       //      engine.addEntity(new Enemy(-1, i % 6 + 8, speed, delay, NUM_COLS));
       //      engine.addEntity(new Mover(-1, i % 6 + 2, speed, delay, NUM_COLS));
       //      delay = Math.random() * 4 + 1;
       //  }
        engine
             .addSubscribtion(new Subscribtion(player, [Enemy],
                 onCollision));
        engine.addSubscribtion(new Subscribtion(player, [SelectorBlock], onWin));
       // // engine.addEntity(new MenuScreen(0, 0, NUM_COLS, NUM_ROWS));
       //  for (var i = 0; i < LIFE_NUMBER; i++) {
       //      engine.addEntity(new Life(i, NUM_ROWS));
       //  }
    }
};