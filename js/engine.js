 /* Engine class provides the game loop functionality (update entities and render),
  * draws the initial game board on the screen, and then calls the update and
  * render methods on your player and enemy objects (defined in your app.js).
  *
  * A game engine works by drawing the entire game screen over and over, kind of
  * like a flipbook you may have created as a kid. When your player moves across
  * the screen, it may look like just that image/character is moving or being
  * drawn but that is not the case. What's really happening is the entire "scene"
  * is being drawn over and over, presenting the illusion of animation.
  * Engine class translates game coordinates to pixels.
  */
 var Engine = function() {
     var gridWidth = 51; // 101;
     var gridHeight = 42;//83;
     var canvasWidth = 969; //505;
     var canvasHeight = 714; //606;
     var lastTime;
     var canvas = document.getElementById("canvas");
     canvas.width = canvasWidth;
     canvas.height = canvasHeight;
     var ctx = canvas.getContext("2d");

     // var playerInfoPanel = document.getElementById("player-info");
     // playerInfoPanel.width = canvasWidth;
     // playerInfoPanel.height = gridHeight;
     // var ctxPlayerInfo = playerInfoPanel.getContext("2d");
     
     this.infoEntities = [];
     this.backgroundEntities = [];
     this.entities = [];

     this.layers = [];
     // this.setUpPlayerInfoPanel = function() {
     //    for (entry in this.infoEntities) {
     //        this.infoEntities[entry].render();
     //    }
     // };

     this.addLayer = function(layer) {
        this.layers.push(layer);
     };
     this.getActiveEntity = function() {
        var upperLeyer = this.layers[this.layers.length - 1];
            for (var i = 0; i < upperLeyer.length; i++) {
                if (upperLeyer[i] instanceof Button && upperLeyer[i].selected === true) {
                    //this.executeCommand(upperLeyer[i].name);
                    this.deleteUpperLayer();
                    break;
                } else if (upperLeyer[i] instanceof Player) {
                    upperLeyer[i].handle
                }
            }
     };
     this.getActiveButton = function(array) {
        for (var i in array) {
            if (array[i].selected === true) {
                return array[i];
            }
        }
     };
     // this.handle = function(keyCode, numRows, numCols) {
       
     //        var upperLeyer = this.layers[this.layers.length - 1];
     //        for (var i = 0; i < upperLeyer.length; i++) {
     //            if (upperLeyer[i] instanceof Player) {
     //                upperLeyer[i].handleInput(keyCode, numRows, numCols);
     //            } else if (upperLeyer[i] instanceof Button) {
     //                if (keyCode === "enter") {
     //                var button = this.getActiveButton(upperLeyer);
     //                console.log(button.name);
     //                //this.executeCommand(upperLeyer[i].name);
     //                this.deleteUpperLayer();
     //                break;
     //                } else if (keyCode === "up") {

     //                }
     //            } 
     //        }
            
            
     // };
     
     this.handleUserInput = function(keyCode, numRows, numCols) {
        var upperLeyer = this.layers[this.layers.length - 1];
        console.log("upperLayer");
        console.log(upperLeyer);
        var sub;
        for (var i = 0; i < this.userInputSubscribtions.length; i++) {
            sub = this.userInputSubscribtions[i];
            for (var j in upperLeyer) {
                if (upperLeyer[j] instanceof sub.entity && keyCode === sub.keyCode){
                    console.log("asd");
                    sub.callback();
                    //sub.callback.call(upperLeyer[j], numRows, numCols);
                }
            }
            

        }
     };

     this.addEntityToLayer = function(entity, layerNumber) {
        this.layers[layerNumber].push(entity);
     };








     this.deleteUpperLayer = function() {
        this.layers.pop();
     }




     this.updatePlayerInfoPanel = function() {
        //ctx.clearRect(0, canvasHeight - gridHeight,canvasWidth, gridHeight);
        //this.deleteInfoEntities();
     };
     this.clearGameBoard = function() {
         ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     };

     this.deleteLayers = function() {
        this.layers.length = 0;
     };
     this.deleteEntities = function() {
         this.entities.length = 0;
     };
     this.deleteInfoEntities = function() {
        this.infoEntities.length = 0;
     };
     this.addBackgroundEntity = function(entity) {
         this.backgroundEntities.push(entity);
     };
     this.deleteBackgroundEntities = function() {
         this.backgroundEntities.length = 0;
     };
     this.addEntity = function(entity) {
         this.entities.push(entity);
     };
     this.addInfoEntity = function(entity) {
        this.infoEntities.push(entity);
     };
     this.load = function() {
         Resources.load([
             'images/stone-block_small.png',
             'images/water-block_small.png',
             'images/grass-block_small.png',
             'images/enemy-bug_small.png',
             'images/char-boy_small.png',
             'images/log_small.png',
             'images/star_small.png',
             'images/heart_small.png'
         ]);
         lastTime = Date.now();
         Resources.onReady(this.start.bind(this));
     };
     this.start = function() {
         var now = Date.now();
         var dt = (now - lastTime) / 1000.0;
         this.update(dt);
         this.render();
         this.checkCollision();
         lastTime = now;
         requestAnimationFrame(this.start.bind(this));
     };
     this.update = function(dt) {
         // for (var entity in this.entities) {
         //     this.entities[entity].update(dt);
         // }

         for (var i = 0; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j].update(dt);
            }
         }
     };
     this.render = function() {
        console.log("render");
         // for (var entity in this.backgroundEntities) {
         //     this.backgroundEntities[entity].render(this);
         // }
         // for (entity in this.entities) {
         //     this.entities[entity].render(this);
         // }
         for (var i = 0; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j].render(this);
            }
         }



        //  for (entity in this.infoEntities) {
        //     this.infoEntities[entity].render(this);
        // }
     };
     this.drawImage = function(sprite, x, y) {
         ctx.drawImage(Resources.get(sprite.image), x * gridWidth + sprite.dx, y * gridHeight + sprite.dy);
     };
     this.drawRect = function(x, y, w, h, color) {
        //ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillStyle = color;
        ctx.fillRect(x * gridWidth, y * gridHeight, w * gridWidth, h * gridHeight);
        // ctx.fillStyle = "yellow";
        // ctx.font = "50px Arial";
        // ctx.fillText("START", 5 * gridWidth, 5 * gridHeight);
     };
     this.drawStrokeRect = function(x, y, w, h, color) {
        //ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        //ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x * gridWidth, y * gridHeight, w * gridWidth, h * gridHeight);


        // ctx.fillStyle = "yellow";
        // ctx.font = "50px Arial";
        // ctx.fillText("START", 5 * gridWidth, 5 * gridHeight);
     };
     this.drawText = function(x, y, text, color, font) {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x * gridWidth, y * gridHeight);
     };
     this.subscribtions = [];
     this.addSubscribtion = function(subscribtion) {
         this.subscribtions.push(subscribtion);
     };
     this.deleteSubscriptions = function() {
         this.subscribtions.length = 0;
     };

     this.userInputSubscribtions = [];
     this.addUserInputSubscribtion = function(userInputSubscribtion) {
        this.userInputSubscribtions.push(userInputSubscribtion);
        //console.log(this.userInputSubscribtions);
     };
     this.deleteUserInputSubscriptions = function() {
        this.userInputSubscribtions.length = 0;
     };



     this.changePlayerPositionToInitial = function() {
        for (var i in this.entities) {
            if (this.entities[i] instanceof Player) {
                this.entities[i].changePositionToInitial();
            }
        }
     };
     this.gameIsOn = function() {
        for (var i in this.entities) {
            if (this.entities[i] instanceof Player) {
                return this.entities[i].isAlive();
            }
        }
     };
     this.decreasePlayerLifeCounter = function() {
        for (var i in this.entities) {
            if (this.entities[i] instanceof Player) {
                this.entities[i].decreaseLifeCounter();

            }
        }
     };
     this.getPlayerLifeNumber = function() {
        for (var i in this.entities) {
            if (this.entities[i] instanceof Player) {
                return this.entities[i].numberOfLifes;

            }
        }
     }
     this.changeLifeIconVisibility = function() {
        for (var i in this.entities) {
            if (this.entities[i] instanceof Life) {
                if (this.entities[i].isVisible === true) {
                    this.entities[i].isVisible = false;
                    break;
                }

            }
        }
     };
     this.checkCollision = function() {
        var currentLayer;
         var s;
         var e;
         var t;
         var c;
         var cX;
         var cwidth;
         var eX;
         var ewidth;
         for (var item in this.subscribtions) {
             s = this.subscribtions[item];
             e = s.entity;
             t = s.types;
             var candidates = [];
             for (var i in t) {
                 // for (var j in entities) {
                 //     if (entities[j] instanceof t[i]) {
                 //         candidates.push(entities[j]);
                 //     }
                 // }
                 for (var k = 0; k < this.layers.length; k++) {
                    currentLayer = this.layers[k];
                    for (var j = 0; j < currentLayer.length; j++) {
                        if (currentLayer[j] instanceof t[i]) {
                         candidates.push(currentLayer[j]);
                     }
                    }
                 }
                 for (j in this.backgroundEntities) {
                     if (this.backgroundEntities[j] instanceof t[i]) {
                         candidates.push(this.backgroundEntities[j]);
                     }
                 }
             }
             eX = e.x + e.sprite.bbox.x;
             ewidth = e.sprite.bbox.w;
             for (var k in candidates) {
                 c = candidates[k];
                 cX = c.x + c.sprite.bbox.x;
                 cwidth = c.sprite.bbox.w;
                 if (((c.y === e.y) && (cX + cwidth >= eX && cX + cwidth <= eX + ewidth)) || ((c.y === e.y) && (eX + ewidth >= cX && eX + ewidth <= cX + cwidth))) {
                     s.callback();
                 }
             }
         }
     };
 };
 var Subscribtion = function(entity, types, callback) {
     this.entity = entity;
     this.types = types;
     this.callback = callback;
 };

 var UserInputSubscribtion = function(keyCode, entity, callback) {
     this.keyCode = keyCode;
     this.entity = entity;
     this.callback = callback;
 };