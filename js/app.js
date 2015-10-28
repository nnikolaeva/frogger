/* app.js file creates instances of entities and provides the game rules 
 */
window.onload = function() {
    var player;
    var NUM_ROWS = 16;
    var NUM_COLS = 19;
    var LIFE_NUMBER = 3;
    var BACKGROUND_LAYER = 0;
    var FOREGROUND_LAYER = 1;
    var MENU_LAYER = 2;
    var NUM_GEMS = 3;

    var engine = new Engine();
    engine.load();

    var SliderConfig = function(min, max, easy, medium, hard, nightmare) {
        this.min = min;
        this.current = min;
        this.max = max;
        this.easy = easy;
        this.medium = medium;
        this.hard = hard;
        this.nightmare = nightmare;
    };

    var Configuration = function(speed, enemyNum, enemyDelay)  {
        // enemy 
        this.speedMin = 0;
        this.speedMax = 14;
        this.speed = speed;
        this.speedEasy = 3;
        this.speedMedium = 5;
        this.speedHard = 10;
        this.speedNightmare = 14;

        this.enemyNum = enemyNum;
        this.enemyEasy = 5;
        this.enemyMedium = 10;
        this.enemyHard = 11;
        this.enemyNightmare = 12;

        // not implemented
        this.enemyDelay = enemyDelay;
        this.enemyDalayEasy = 1;



        this.getSpeed = function() {
            return this.speed;
        };
        this.getEnemiesNum = function() {
            return this.enemyNum;
        };
        this.getEnemyDelay = function() {
            return this.enemyDelay;
        };
        // set level
        this.setEasyLevel = function() {
            this.speed = this.speedEasy;
            this.enemyNum = this.enemyEasy;
        };
        this.setMediumLevel = function() {
            this.speed = this.speedMedium;
            this.enemyNum = this.enemyMedium;
        };
        this.setHardLevel = function() {
            this.speed = this.speedHard;
            this.enemyNum = this.enemyHard;
        };
        this.setNightmareLevel = function() {
            this.speed = this.speedNightmare;
            this.enemyNum = this.enemyNightmare;
        };

        this.setSpeed = function(speed) {
            this.speed = speed;
        };
        this.reduceSpeed = function() {
            this.speed --;
        };
        this.increaseSpeed = function() {
            this.speed ++;
        };
        this.reduceEnemyNum = function() {
            this.enemyNum --;
        };
        this.increaseEnemyNum = function() {
            this.enemyNum ++;
        };
        this.getSpeedEasyValue = function() {
            return this.speedEasy;
        };
        this.getSpeedMediumValue = function() {
            return this.speedMedium;
        };
        this.getSpeedHardValue = function() {
            return this.speedHard;
        };
        this.getSpeedNightmareValue = function() {
            return this.speedNightmare;
        };
        this.getEnemyEasyValue = function() {
            return this.enemyEasy;
        };
        this.getEnemyMediumValue = function() {
            return this.enemyMedium;
        };
        this.getEnemyHardValue = function() {
            return this.enemyHard;   
        };
        this.getEnemyNightmareValue = function() {
            return this.enemyNightmare;   
        };
    };
    var config = new Configuration(0, 5, 1);

    //setUpEntities();
    //setUpStartMenu();
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            13: 'enter'
        };
        engine.handleUserInput(allowedKeys[e.keyCode], NUM_ROWS, NUM_COLS);
    });




    function resetGame() {
        engine.emptyScreen();
        engine.deleteSubscriptions();
        engine.deleteUserInputSubscriptions();
        setUpGameOverMenu();
    }

    function resetLevel() {
        player.changePositionToInitial();
        engine.changeLifeIconVisibility();
    }

    function onCollision() {
        if (player.numberOfLifes > 1) {
            player.numberOfLifes--;
            resetLevel();
        } else {
            resetGame();
        }
    }

    function onWin() {
        if (player.isKeyObtained === true) {
            engine.emptyScreen();
            engine.deleteSubscriptions();
            engine.deleteUserInputSubscriptions();
            setUpWinMenu();
        }
    }

    function setUpEntities() {
        setUpBackground();
        setUpForeground(config);
        setUpMenu();
    }

    function setUpBackground() {
        for (var col = 0; col < NUM_COLS; col++) {
            for (var row = 0; row < NUM_ROWS - 1; row++) {
                if ((row === 0 && col % 2 === 0) || (row === 7) || (row === 14)) {
                    engine.addEntityToScreen(new GrassBlock(col, row));
                } else if ((row === 0 && col % 2 !== 0) || (row > 0 && row < 7)) {
                    engine.addEntityToScreen(new WaterBlock(col, row), BACKGROUND_LAYER);
                } else {
                    engine.addEntityToScreen(new StoneBlock(col, row), BACKGROUND_LAYER);
                }
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
                number = getRundomNum(NUM_COLS);
                number = (number % 2 === 0) ? number : number - 1;
                if (!isExisted(number, result)) {
                    result.push(number);
                    counter ++;
                }
            }
            return result;
        }

        // setup exits
        var transportNum = 5;
        var exitsX = getDiffRandomExits(transportNum);
        console.log(exitsX);
        for (var i = 0; i < transportNum; i++) {
            engine.addEntityToScreen(new SelectorBlock(exitsX[i], 0), BACKGROUND_LAYER);
        }

        
        var blueGem = new BlueGem(getRundomNum(NUM_COLS), getRundomNum(NUM_ROWS));
        engine.addEntityToScreen(blueGem, BACKGROUND_LAYER);
        engine.addSubscribtion(new Subscribtion(blueGem, [Player], blueGem.changePosition.bind(blueGem, NUM_COLS, NUM_ROWS)));

        var greenGem = new GreenGem(getRundomNum(NUM_COLS), getRundomNum(NUM_ROWS));
        engine.addEntityToScreen(greenGem, BACKGROUND_LAYER);
        engine.addSubscribtion(new Subscribtion(greenGem, [Player], greenGem.changePosition.bind(greenGem, NUM_COLS, NUM_ROWS)));

        var orangeGem = new OrangeGem(getRundomNum(NUM_COLS), getRundomNum(NUM_ROWS));
        engine.addEntityToScreen(orangeGem, BACKGROUND_LAYER);
        engine.addSubscribtion(new Subscribtion(orangeGem, [Player], orangeGem.changePosition.bind(orangeGem, NUM_COLS, NUM_ROWS)));

        var key = new Key(getRundomNum(NUM_COLS), getRundomNum(NUM_ROWS));
        engine.addEntityToScreen(key, BACKGROUND_LAYER);
        //engine.addSubscribtion(new Subscribtion(key, [Player], key.moveToPlayerPanel.bind(key))); 

        //  for (var i = 0; i < LIFE_NUMBER; i++) {
        //      engine.addEntity(new Life(i, NUM_ROWS));
        //  }
    }

    function setUpForeground(config) { //pass num of enemies and speed
        player = new Player(9, 14, LIFE_NUMBER);

        engine.addEntityToScreen(player, FOREGROUND_LAYER);

        var speed;
        var delay = 0;
        // setup enemies
        for (var i = 0; i < config.getEnemiesNum(); i++) {
            speed = Math.random() * 2 + config.getSpeed();
            engine.addEntityToScreen(new Enemy(-1, i % 6 + 8, speed, delay, NUM_COLS), FOREGROUND_LAYER);
            delay = Math.random() * 4 + config.getEnemyDelay();
        }

        // setup transport
        for (var i = 0; i < 10; i++) {
            speed = Math.random() * 2 + 2;
            if ((i % 6) % 2 === 0) {
                engine.addEntityToScreen(new Mover(-1, i % 6 + 2, speed, delay, NUM_COLS), FOREGROUND_LAYER);   
            } else {
                engine.addEntityToScreen(new CounterMover(NUM_COLS, i % 6 + 2, speed, delay, NUM_COLS), FOREGROUND_LAYER);
                }
            delay = Math.random() * 4 + 1;


        }

        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", player, player.moveUp.bind(player)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", player, player.moveDown.bind(player)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("left", player, player.moveLeft.bind(player)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("right", player, player.moveRight.bind(player)));
        engine.addSubscribtion(new Subscribtion(player, [Enemy], onCollision));
        //engine.addSubscribtion(new Subscribtion(player, [WaterBlock], onCollision));
        engine.addSubscribtion(new Subscribtion(player, [SelectorBlock], onWin));
        engine.addSubscribtion(new Subscribtion(player, [BlueGem], player.increaseScore.bind(player, 10)));
        engine.addSubscribtion(new Subscribtion(player, [Mover], player.floating.bind(player)));
        engine.addSubscribtion(new Subscribtion(player, [CounterMover], player.floating.bind(player)));
        engine.addSubscribtion(new Subscribtion(player, [Key], player.obtainKey.bind(player))); //doesn't work with key [Player]

        var timer = new Timer(4, 17, "Time", "#009900", "bold 20px Gloria Hallelujah", 30);
        engine.addEntityToScreen(timer);
        engine.addTimeSubscribtion(new TimeSubscribtion(timer, 0, resetGame));
    }
    // new
    var ConfigMenuController = function(engine) {
        this.engine = engine;
        this.easyButtonCallback = function() {
            config.setEasyLevel();
        };
        this.mediumButtonCallback = function() {
            config.setMediumLevel();
        };
        this.hardButtonCallback = function() {
            config.setHardLevel();
        };
        this.nightmareButtonCallback = function() {
            config.setNightmareLevel();
        };
        this.startButtonCallback = function() {
            engine.emptyScreen();
            setUpBackground();
            setUpForeground(config);
        };
        this.speedLeftCallback = function() {
            console.log(config.getSpeed());
            config.reduceSpeed();
            this.moveLeft();
            console.log(config.getSpeed());
        };
        this.speedRightCallback = function() {
            config.increaseSpeed();
            this.moveRight();
        };
        this.enemyNumLeftCallback = function() {
            config.reduceEnemyNum();
            this.moveLeft(); // move to ConfigMenu
        };
        this.enemyNumRightCallback = function() {
            config.increaseEnemyNum();
            this.moveRight();
        };
        

        this.setUpConfigMenu = function() {
            var configMenu  = new ConfigMenu(NUM_COLS, NUM_ROWS, this.easyButtonCallback, this.mediumButtonCallback, this.startButtonCallback, config, this.speedLeftCallback, this.speedRightCallback, this.enemyNumLeftCallback, this.enemyNumRightCallback, this.hardButtonCallback, this.nightmareButtonCallback);
            this.engine.addEntityToScreen(configMenu);
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", configMenu, configMenu.handleEnter.bind(configMenu)));
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("up", configMenu, configMenu.handleUp.bind(configMenu)));
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("down", configMenu, configMenu.handleDown.bind(configMenu)));
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("left", configMenu, configMenu.handleLeft.bind(configMenu)));
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("right", configMenu, configMenu.handleRight.bind(configMenu)));
            

        };
    };
    
    var configMenuController = new ConfigMenuController(engine);
    var StartMenuController = function(engine) {
        this.engine = engine;
        this.startButtonCallback = function() {
            engine.emptyScreen();
            setUpBackground();
            setUpForeground(config);
        };
        this.configButtonCallBack = function() {
            // engine.emptyScreen();
            // engine.deleteSubscriptions();
            // engine.deleteUserInputSubscriptions();
            // setConfigMenu(config);
            engine.emptyScreen();
            engine.deleteSubscriptions();
            engine.deleteUserInputSubscriptions();
            configMenuController.setUpConfigMenu();
        };

        this.setUpStartMenu = function() {
            var startMenu  = new StartMenu(NUM_COLS, NUM_ROWS, this.startButtonCallback, this.configButtonCallBack);
            this.engine.addEntityToScreen(startMenu);
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", startMenu, startMenu.handleEnter.bind(startMenu)));
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("up", startMenu, startMenu.handleUp.bind(startMenu)));
            this.engine.addUserInputSubscribtion(new UserInputSubscribtion("down", startMenu, startMenu.handleDown.bind(startMenu)));
            

        };
    };
    var startMenuController = new StartMenuController(engine);
    startMenuController.setUpStartMenu();

    function setUpGameOverMenu(){
        var menu = new Menu(0, 0, NUM_COLS, NUM_ROWS);
        menu.setBanner(new TextEntity(2, 4, "Game Over", "#009900", "bold 150px Gloria Hallelujah"));
        var startButton = new Button(7, 9, "start");
        startButton.onClick = function() {
            engine.emptyScreen();
            setUpBackground();
            setUpForeground(config);
        }
        menu.addButton(startButton);

        var configButton = new Button(7, 11, "configs");
        configButton.onClick = function() {
            console.log("configButton");
        };
        menu.addButton(configButton);
        engine.addEntityToScreen(menu);
        console.log(engine.screen);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", menu, menu.handleEnterInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", menu, menu.handleUpInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", menu, menu.handleDownInput.bind(menu)));
    }

    function setUpWinMenu(){
        var menu = new Menu(0, 0, NUM_COLS, NUM_ROWS);
        menu.setBanner(new TextEntity(2, 4, "You Win!", "#009900", "bold 150px Gloria Hallelujah"));
        var startButton = new Button(7, 9, "start");
        startButton.onClick = function() {
            engine.emptyScreen();
            setUpBackground();
            setUpForeground(config);
        }
        menu.addButton(startButton);

        var configButton = new Button(7, 11, "configs");
        configButton.onClick = function() {
            console.log("configButton");
        };
        menu.addButton(configButton);
        engine.addEntityToScreen(menu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", menu, menu.handleEnterInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", menu, menu.handleUpInput.bind(menu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", menu, menu.handleDownInput.bind(menu)));
    }

    
    

    function setConfigMenu(config) {
        var configMenu = new Menu(0, 0, NUM_COLS, NUM_ROWS);
        configMenu.setConfig(config);
        configMenu.setBanner(new TextEntity(2, 4, "Select Difficulty", "#009900", "bold 100px Gloria Hallelujah"));
        var easyLevelButton = new Button(5, 7, "Easy");
        easyLevelButton.onClick = function() {
            console.log("Easy Button");
        };
        configMenu.addButton(easyLevelButton);

        var mediumLevelButton = new Button(5, 9, "Medium");
        mediumLevelButton.onClick = function() {
            console.log("Medium Button");
        };
        configMenu.addButton(mediumLevelButton);

        var hardLevelButton = new Button(12, 7, "Hard");
        hardLevelButton.onClick = function() {
            console.log("Hard Button");
        };
        configMenu.addButton(hardLevelButton);

        // var customLevelButton = new Button(12, 9, "Customize");
        // customLevelButton.onClick = function() {
        //     console.log("Customize Button");
        //     configMenu.activateSliders();
        // };
        // configMenu.addButton(customLevelButton);

        //engine.addEntityToScreen(new LineEntity(1, 10, 10, 10, 10, "white"));
        //engine.addEntityToScreen(new LineEntity(1, 10, 10, 10, 5, "#009900"));
        //engine.addEntityToScreen(new LineEntity(1, 10, 10, 10, 10, "#009900"));
        //engine.addEntityToScreen(new CircleEntity(5, 10, 10, "#009900"));

        var slider = new Slider(1, 10, 10, 10, "Speed", config.getSpeed(), 1, 10, "#009900");
        configMenu.addButton(slider);
        slider.onReduce = function() {
            console.log("slider reduced");
            console.log(config.getSpeed());
            config.reduceSpeed();
            this.selector.x = config.getSpeed();
            console.log(config.getSpeed());
        };
        slider.onIncrease = function() {
            console.log("slider increased");
            console.log(config.getSpeed());
            config.increaseSpeed();
            this.selector.x = config.getSpeed();
            console.log(config.getSpeed());
        };

        var enemySlider = new Slider(1, 12, 10, 12, "Speed", config.getSpeed(), 1, 10, "#009900");
        configMenu.addButton(enemySlider);
        enemySlider.onReduce = function() {
            config.reduceSpeed();
            this.selector.x = config.getSpeed();
        };
        enemySlider.onIncrease = function() {
            config.increaseSpeed();
            this.selector.x = config.getSpeed();
        };
        //configMenu.addSlider(new Slider(1, 12, 10, 12, "Speed", 5, 1, 10, "#009900"));
        var startButtonConfig = new Button(12, 17, "Done");
        startButtonConfig.onClick = function() {
            engine.emptyScreen();
            setUpBackground();
            setUpForeground(config);
        }
        configMenu.addButton(startButtonConfig);


        engine.addEntityToScreen(configMenu);
        engine.addUserInputSubscribtion(new UserInputSubscribtion("enter", configMenu, configMenu.handleEnterInput.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("up", configMenu, configMenu.handleUpInput.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("down", configMenu, configMenu.handleDownInput.bind(configMenu)));
        engine.addUserInputSubscribtion(new UserInputSubscribtion("left", configMenu, configMenu.handleLeftInput.bind(configMenu)));

    };

    

};