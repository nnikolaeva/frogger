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
     var canvasHeight = 840; //606;
     var lastTime;
     var canvas = document.getElementById("canvas");
     canvas.width = canvasWidth;
     canvas.height = canvasHeight;
     var ctx = canvas.getContext("2d");
     this.backgroundEntities = [];
     this.entities = [];
     this.clearGameBoard = function() {
         ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     };
     this.deleteEntities = function() {
         this.entities.length = 0;
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
     this.load = function() {
         Resources.load([
             'images/stone-block_small.png',
             'images/water-block_small.png',
             'images/grass-block_small.png',
             'images/enemy-bug_small.png',
             'images/char-boy_small.png',
             'images/log_small.png',
             'images/star_small.png'
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
         for (var entity in this.entities) {
             this.entities[entity].update(dt);
         }
     };
     this.render = function() {
         for (var entity in this.backgroundEntities) {
             this.backgroundEntities[entity].render(this);
         }
         for (entity in this.entities) {
             this.entities[entity].render(this);
         }
     };
     this.drawImage = function(sprite, x, y) {
         ctx.drawImage(Resources.get(sprite.image), x * gridWidth + sprite.dx, y * gridHeight + sprite.dy);
     };
     this.subscribtions = [];
     this.addSubscribtion = function(subscribtion) {
         this.subscribtions.push(subscribtion);
     };
     this.deleteSubscriptions = function() {
         this.subscribtions.length = 0;
     };
     this.checkCollision = function() {
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
                 for (var j in this.entities) {
                     if (this.entities[j] instanceof t[i]) {
                         candidates.push(this.entities[j]);
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