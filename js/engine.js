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
     var gridWidth = 51;
     var gridHeight = 42;
     var canvasWidth = 969;
     var canvasHeight = 714;
     var lastTime;
     var canvas = document.getElementById("canvas");
     canvas.width = canvasWidth;
     canvas.height = canvasHeight;
     var ctx = canvas.getContext("2d");
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


     this.handleUserInput = function(keyCode, numRows, numCols) {
         //var upperLeyer = this.layers[this.layers.length - 1];
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
             'images/stone-block_small.png',
             'images/water-block_small.png',
             'images/grass-block_small.png',
             'images/enemy-bug_small.png',
             'images/char-boy_small.png',
             'images/log_small.png',
             'images/star_small.png',
             'images/heart_small.png',
             'images/gem-blue_small.png',
             'images/gem-green_small.png',
             'images/gem-orange_small.png',
             'images/key_small.png'
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
             for (var i in t) {
                 for (var k = 0; k < this.screen.length; k++) {
                     //currentLayer = this.layers[k];
                     //for (var j = 0; j < currentLayer.length; j++) {
                         if (this.screen[k] instanceof t[i]) {
                             candidates.push(this.screen[k]);
                         }
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

 