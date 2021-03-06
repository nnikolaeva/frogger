var MenuController = function(engine, COLS, ROWS) {

    var gameController = new GameController(engine, COLS, ROWS);

    var configMenuController = new ConfigMenuController(engine, gameController);

    var levelMenuController = new LevelMenuController(engine, gameController, configMenuController);

    var startMenuController = new StartMenuController(engine, gameController, levelMenuController);

    var gameOverMenuController = new GameOverMenuController(engine, gameController, levelMenuController);
    var winMenuController = new WinMenuController(engine, gameController, levelMenuController);
    var pauseMenuController = new PauseMenuController(engine, startMenuController);

    this.openStartMenu = function() {
        startMenuController.setUpStartMenu();
    };

    gameController.setUpGameOverCallback(gameOverMenuController.setUpGameOverMenu);
    gameController.setUpWinCallback(winMenuController.setUpWinMenu);
    gameController.setPauseCallback(pauseMenuController.setUpPauseMenu);
};


var GameController = function(engine, width, height) {
    var player;
    var lifeCounter;
    var keyCounter;
    var scoreCounter;
    var LIFE_NUMBER = 3;
    var NUM_GEMS = 3;

    var gameOver;
    var win;
    var pause;

    this.setUpGameOverCallback = function(callback) {
        gameOver = callback;
    };
    this.setUpWinCallback = function(callback) {
        win = callback;
    };
    this.setPauseCallback = function(callback) {
        pause = callback;
    };
    this.startGame = function() {
        engine.emptyScreen();
        setUpBackground();
        setUpForeground(config);
    };

    function runOutOfLifesGameOver() {
        engine.emptyScreen();
        gameOver("run out of lives");
    }

    function runOutOfTimeGameOver() {
        engine.emptyScreen();
        gameOver("time is up");
    }

    function resetLevel() {
        player.changePositionToInitial();
    }

    function onCollision() {
        if (player.numberOfLifes > 1) {
            player.numberOfLifes--;
            lifeCounter.decreaseCount();
            resetLevel();
        } else {
            runOutOfLifesGameOver();
        }
    }

    function onWin() {
        if (player.isKeyObtained === true || keyCounter.requiredKeyCount === 0) {
            engine.emptyScreen();
            win();
        }
    }

    function onKeyPickedUp(key) {
        keyCounter.changeCounter();
        key.changeState();
        if (keyCounter.currentKeyCount === keyCounter.requiredKeyCount) {
            player.obtainKey();
        }
    }

    function onGemPickedUp(gem) {
        scoreCounter.changeCounter(gem.bonusNumber);
        gem.changePosition();
    }

    function onLifePickedUp(life) {
        player.numberOfLifes ++;
        lifeCounter.increaseCount();
        life.changePosition();
    }

    function onWater() {
        player.inWater = true;
        if (!player.wasFloating) {
            onCollision();
        }
    }

    function getRundomNum(num) {
        return Math.round(Math.random() * num);
    }

    function getDiffRandomExits(qty) {
        var result = [];
        var number;
        var counter = 0;

        function isExisted(num, array) {
            for (var i in array) {
                if (array[i] === num) {
                    return true;
                }
            }
            return false;
        }
        while (counter < qty) {
            number = getRundomNum(width);
            number = (number % 2 === 0) ? number : number - 1;
            if (!isExisted(number, result)) {
                result.push(number);
                counter++;
            }
        }
        return result;
    }

    var setUpBackground = function() {
        for (var col = 0; col < width; col++) {
            for (var row = 0; row < height; row++) {
                if ((row === 0 && col % 2 === 0) || (row === 8) || (row === 17)) {
                    engine.addEntityToScreen(new GrassBlock(col, row));
                } else if ((row === 0 && col % 2 !== 0) || (row > 0 && row < 8)) {
                    engine.addEntityToScreen(new WaterBlock(col, row));
                } else if (row === height - 1) {
                    engine.addEntityToScreen(new RectangleEntity(col, 19, 1, 2));
                } else {
                    engine.addEntityToScreen(new StoneBlock(col, row));
                }
            }
        }
        // setup exits
        var exitCount = assertDefined(config.exit.num.value);
        var exitsX = getDiffRandomExits(exitCount);
        for (var i = 0; i < exitCount; i++) {
            engine.addEntityToScreen(new SelectorBlock(exitsX[i], 0));
        }
        // setup gems
        for (var i = 0; i < NUM_GEMS; i++) {
            engine.addEntityToScreen(new BlueGem(width - 1, height - 3));
            engine.addEntityToScreen(new GreenGem(width - 1, height - 3));
            engine.addEntityToScreen(new OrangeGem(width - 1, height - 3));
        }

        var KeyCount = assertDefined(config.key.num.value);
        for (var i = 0; i < KeyCount; i++) {
            engine.addEntityToScreen(new Key(getRundomNum(width - 1), getRundomNum(height - 2)));    
        }
        
        lifeCounter = new LifeCounter(0, 19, LIFE_NUMBER);
        engine.addEntityToScreen(lifeCounter);

        keyCounter = new KeyCounter(3, 19, KeyCount);
        engine.addEntityToScreen(keyCounter);

        scoreCounter = new ScoreCounter(17, 19);
        engine.addEntityToScreen(scoreCounter);

        engine.addEntityToScreen(new Life(width - 1, height - 2));
    };

    var setUpForeground = function() {
        var enemySpeed = assertDefined(config.enemy.speed.value);
        var enemyCount = assertDefined(config.enemy.num.value);
        var enemyDelay = assertDefined(config.enemy.delay.value);

        // setup enemies
        var speed;
        var delay = 0;
        for (var i = 0; i < enemyCount; i++) {
            speed = Math.random() * 2 + enemySpeed;
            if ((i % 8) % 2 === 0) {
                engine.addEntityToScreen(new EnemyLeftToRight(-1, i % 8 + 9, speed, delay, width));
            } else {
                engine.addEntityToScreen(new EnemyRightToLeft(width, i % 8 + 9, -1 * speed, delay, width));
            }
            delay = Math.random() * 4 + enemyDelay;
        }

        // setup transport
        var transportSpeed = assertDefined(config.transport.speed.value);
        var transportCount = assertDefined(config.transport.num.value);
        var transportDelay = assertDefined(config.transport.delay.value);



        for (var i = 0; i < transportCount; i++) {
            speed = Math.random() * 2 + transportSpeed;
            if ((i % 7) % 2 === 0) {
                engine.addEntityToScreen(new Transport(-1, i % 7 + 1, width, delay, speed, 3));
            } else {
                engine.addEntityToScreen(new Transport(width + 2, i % 7 + 1, width, delay, -1 * speed, 2));
            }
            delay = Math.random() * 4 + transportDelay;


        }

        player = new Player(Math.floor(width / 2), height - 2, LIFE_NUMBER, width, height);
        engine.addEntityToScreen(player);
        player.setfloatOutOfScreenCallback(onCollision);

        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", player, player.moveUp.bind(player, width, height - 1)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", player, player.moveDown.bind(player, width, height - 1)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("left", player, player.moveLeft.bind(player, width, height - 1)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("right", player, player.moveRight.bind(player, width, height - 1)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("esc", player, pause));
        engine.addSubscribtion(new Subscribtion(player, [EnemyLeftToRight, EnemyRightToLeft], onCollision));
        engine.addSubscribtion(new Subscribtion(player, [SelectorBlock], onWin));
        engine.addSubscribtion(new Subscribtion(player, [BlueGem, GreenGem, OrangeGem], onGemPickedUp));
        engine.addSubscribtion(new Subscribtion(player, [Life], onLifePickedUp));
        engine.addSubscribtion(new Subscribtion(player, [TransportPart], player.floating.bind(player)));
        engine.addSubscribtion(new Subscribtion(player, [WaterBlock], onWater));
        engine.addSubscribtion(new Subscribtion(player, [Key], onKeyPickedUp));

        var timer = new Timer(10, 20, 45);
        engine.addEntityToScreen(timer);
        engine.addTimeSubscribtion(new TimeSubscribtion(timer, 0, runOutOfTimeGameOver));
    };
};

var StartMenuController = function(engine, gameController, levelMenuController) {
    var levelButtonCallBack = function() {
        engine.emptyScreen();
        levelMenuController.setUpLevelMenu();
    };

    this.setUpStartMenu = function() {
        var startMenu = new StartMenu(gameController.startGame.bind(gameController), levelButtonCallBack);
        engine.addEntityToScreen(startMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", startMenu, startMenu.handleEnter.bind(startMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", startMenu, startMenu.handleUp.bind(startMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", startMenu, startMenu.handleDown.bind(startMenu)));
    };
};

var ConfigMenuController = function(engine, gameController) {
    this.setUpConfigMenu = function() {
        var configMenu = new ConfigMenu(config, gameController.startGame);
        engine.addEntityToScreen(configMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", configMenu, configMenu.handleEnter.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", configMenu, configMenu.handleUp.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", configMenu, configMenu.handleDown.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("left", configMenu, configMenu.handleLeft.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("right", configMenu, configMenu.handleRight.bind(configMenu)));
    };
};

var LevelMenuController = function(engine, gameController, configMenuController) {
    var configButtonCallBack = function() {
        engine.emptyScreen();
        configMenuController.setUpConfigMenu();
    };
    var easyButtonCallback = function() {
        setConfigToLevel(0);
        gameController.startGame();
    };
    var mediumButtonCallback = function() {
        setConfigToLevel(1);
        gameController.startGame();
    };
    var hardButtonCallback = function() {
        setConfigToLevel(2);
        gameController.startGame();
    };
    this.setUpLevelMenu = function() {
        var levelMenu = new LevelMenu(easyButtonCallback, mediumButtonCallback, hardButtonCallback, configButtonCallBack);
        engine.addEntityToScreen(levelMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", levelMenu, levelMenu.handleEnter.bind(levelMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", levelMenu, levelMenu.handleUp.bind(levelMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", levelMenu, levelMenu.handleDown.bind(levelMenu)));
    };
};

var GameOverMenuController = function(engine, gameController, levelMenuController) {
    var levelButtonCallBack = function() {
        engine.emptyScreen();
        levelMenuController.setUpLevelMenu();
    };
    this.setUpGameOverMenu = function(reason) {
        var gameOverMenu = new GameOverMenu(gameController.startGame.bind(gameController), levelButtonCallBack, reason);
        engine.addEntityToScreen(gameOverMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", gameOverMenu, gameOverMenu.handleEnter.bind(gameOverMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", gameOverMenu, gameOverMenu.handleUp.bind(gameOverMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", gameOverMenu, gameOverMenu.handleDown.bind(gameOverMenu)));
    };
};

var WinMenuController = function(engine, gameController, levelMenuController) {
    var levelButtonCallBack = function() {
        engine.emptyScreen();
        levelMenuController.setUpLevelMenu();
    };
    this.setUpWinMenu = function() {
        var winMenu = new WinMenu(gameController.startGame.bind(gameController), levelButtonCallBack);
        engine.addEntityToScreen(winMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", winMenu, winMenu.handleEnter.bind(winMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", winMenu, winMenu.handleUp.bind(winMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", winMenu, winMenu.handleDown.bind(winMenu)));
    };
};

var PauseMenuController = function(engine, startMenuController) {
    var resumeButtonCallback = function() {
        engine.emptyScreen();
        engine.pasteCurrentGameState();
        engine.on = true;
    };
    var startMenuButtonCallback = function() {
        engine.emptyScreen();
        engine.on = true;
        startMenuController.setUpStartMenu();
    };
    this.setUpPauseMenu = function() {
        engine.on = false;
        engine.copyCurrentGameState();
        engine.emptyScreen();
        var pauseMenu = new PauseMenu(resumeButtonCallback, startMenuButtonCallback);
        engine.addEntityToScreen(pauseMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", pauseMenu, pauseMenu.handleEnter.bind(pauseMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", pauseMenu, pauseMenu.handleUp.bind(pauseMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", pauseMenu, pauseMenu.handleDown.bind(pauseMenu)));
    };

};