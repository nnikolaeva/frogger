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
     var gridWidth = 40;
     var gridHeight = 33;
     var canvasWidth = 920;
     var canvasHeight = 680;
     var lastTime;
     var canvas = document.getElementById("canvas");
     canvas.width = canvasWidth;
     canvas.height = canvasHeight;
     var ctx = canvas.getContext("2d");
     this.on = true;
     this.layers = [
         [],
         [],
         []
     ];

     this.screen = [];

     this.addEntityToScreen = function(entity) {
         this.screen.push(entity);
     };

     this.emptyScreen = function() {
         this.screen.length = 0;
     };

     this.screenBackup = [];
     this.subscribtionsBackup = [];
     this.userInputSubscribtionsBackup = [];

     this.copyCurrentGameState = function() {
         copyArrays(this.screen, this.screenBackup);
         copyArrays(this.subscribtions, this.subscribtionsBackup);
         copyArrays(this.userInputSubscribtions, this.userInputSubscribtionsBackup);
     };

     this.pasteCurrentGameState = function() {
         copyArrays(this.screenBackup, this.screen);
         copyArrays(this.subscribtionsBackup, this.subscribtions);
         copyArrays(this.userInputSubscribtionsBackup, this.userInputSubscribtions);

         // empty backup
         this.screenBackup.length = 0;
         this.subscribtionsBackup.length = 0;
         this.userInputSubscribtionsBackup.length = 0;

     };

     function copyArrays(array1, array2) {
         for (var i in array1) {
             array2.push(array1[i]);
         }
     }

     this.handleUserInput = function(keyCode, numRows, numCols) {
         var sub;
         for (var i = 0; i < this.userInputSubscribtions.length; i++) {
             sub = this.userInputSubscribtions[i];
             for (var j in this.screen) {
                 if (this.screen[j] === sub.entity && keyCode === sub.keyCode) {
                     sub.callback(this.screen[j]);
                 }
             }
         }
     };

     this.checkTimer = function() {
         var sub;
         for (var i in this.timeSubscribtions) {
             sub = this.timeSubscribtions[i];
             if (sub.entity.seconds < sub.number) {
                 sub.callback();
             }
         }
     };

     this.addLayer = function(layer) {
         this.layers.push(layer);
     };

     this.deleteLayers = function() {
         this.layers.length = 0;
     };

     this.addEntityToLayer = function(entity, layerNumber) {
         if (typeof this.layers[layerNumber] === "undefined") {
             var array = [];
             this.layers.push(array);
         };
         this.layers[layerNumber].push(entity);
     };

     this.deleteUpperLayer = function() {
         this.layers.pop();
     }

     this.clearGameBoard = function() {
         ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     };

     this.load = function() {
         Resources.load([
             'images/stone-block_small_1.png',
             'images/water-block_small_1.png',
             'images/grass-block_small_1.png',
             'images/enemy-bug_small_1.png',
             'images/char-boy_small_1.png',
             'images/log_small_1.png',
             'images/lock.png',
             'images/heart_small_1.png',
             'images/gem-blue_small_1.png',
             'images/gem-blue_new.png',
             'images/gem-green_new.png',
             'images/gem-orange_new.png',
             'images/key_small_1.png',
             'images/new.png',
             'images/newlog.png',
         ]);
         lastTime = Date.now();
         Resources.onReady(this.start.bind(this));
     };

     this.start = function() {
         var now = Date.now();
         var dt = (now - lastTime) / 1000.0;
         if (this.on) {
             this.update(dt);
         }
         this.render();
         this.checkCollision();
         this.checkTimer(dt);
         lastTime = now;

         requestAnimationFrame(this.start.bind(this));

     };

     this.update = function(dt) {
         for (var i = 0; i < this.screen.length; i++) {
             this.screen[i].update(dt);
         }
     };

     this.render = function() {
         for (var i = 0; i < this.screen.length; i++) {
             this.screen[i].render(this);
         }
     };

     this.drawImage = function(sprite, x, y) {
         ctx.drawImage(Resources.get(sprite.image), x * gridWidth + sprite.dx, y * gridHeight + sprite.dy);
     };
     this.drawRect = function(x, y, w, h, color) {
         ctx.fillStyle = color;
         ctx.fillRect(x * gridWidth, y * gridHeight, w * gridWidth, h * gridHeight);
     };

     this.drawFullScreenRect = function(color) {
         ctx.fillStyle = color;
         ctx.fillRect(0, 0, canvasWidth, canvasHeight);
     };


     this.drawText = function(x, y, text, color, font) {
         ctx.fillStyle = color;
         ctx.font = font;
         ctx.fillText(text, x * gridWidth, y * gridHeight);
     };

     this.drawLine = function(x, y, x1, y1, width, color) {
         ctx.beginPath();
         ctx.moveTo(x * gridWidth, y * gridHeight);
         ctx.lineTo(x1 * gridWidth, y1 * gridHeight);
         ctx.lineWidth = width;
         ctx.strokeStyle = color;
         ctx.stroke();
     };

     this.drawCircle = function(x, y, radius, color) {
         ctx.beginPath();
         ctx.arc(x * gridWidth, y * gridHeight, radius, 0, 2 * Math.PI);
         ctx.fillStyle = color;
         ctx.fill();

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
     };
     this.deleteUserInputSubscriptions = function() {
         this.userInputSubscribtions.length = 0;
     };

     this.timeSubscribtions = [];
     this.addTimeSubscribtion = function(timeSubscribtion) {
         this.timeSubscribtions.push(timeSubscribtion);
     };
     this.deleteTimeSubscriptions = function() {
         this.timeSubscribtions.length = 0;
     };

     // TODO: Remove method
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
             var element;
             for (var i in t) {
                 for (var k = 0; k < this.screen.length; k++) {
                     element = this.screen[k];

                     //currentLayer = this.layers[k];
                     //for (var j = 0; j < currentLayer.length; j++) {
                     if (element instanceof t[i]) {
                         candidates.push(element);
                     }
                     // if (typeof this.screen[k].components !== "undefined") {
                     for (l in element.components) {
                         if (element.components[l] instanceof t[i]) {
                             candidates.push(element.components[l]);
                         }
                     }
                     // }
                     //}
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
                     s.callback(c);
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

 var TimeSubscribtion = function(entity, number, callback) {
     this.entity = entity;
     this.number = number;
     this.callback = callback;
 };