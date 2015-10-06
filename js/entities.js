/* entities.js file provides all entities classes for game.
 */
function simpleSprite(image) {
    return sprite(image, 0, 0, defaultBoundingBox());
}

function sprite(image, dx, dy, boundingBox) {
    return {
        image: image,
        dx: dx,
        dy: dy,
        bbox: boundingBox
    };
}

function defaultBoundingBox() {
    return boundingBox(0, 0, 1, 1);
}

function boundingBox(x, y, w, h) {
    return {
        x: x,
        y: y,
        w: w,
        h: h
    };
}
var Entity = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.update = function() {};
    this.render = function(engine) {
        engine.drawImage(this.sprite, this.x, this.y);
    };
};
var WaterBlock = function(x, y) {
    Entity.call(this, x, y, simpleSprite('images/water-block_small.png'));
};
var StoneBlock = function(x, y) {
    Entity.call(this, x, y, simpleSprite('images/stone-block_small.png'));
};
var GrassBlock = function(x, y) {
    Entity.call(this, x, y, simpleSprite('images/grass-block_small.png'));
};
var SelectorBlock = function(x, y) {
    Entity.call(this, x, y, simpleSprite('images/star_small.png'));
};
var Enemy = function(x, y, speed, delay, numCols) {
    Entity.call(this, x, y, sprite('images/enemy-bug_small.png', 0, -10, defaultBoundingBox()));
    this.initialX = x;
    this.isVisible = false;
    this.delay = delay;
    this.initDelay = delay;
    this.speed = speed;
    this.update = function(dt) {
        if (this.delay > 0) {
            this.delay -= dt;
        } else {
            this.isVisible = true;
            this.x = this.x + dt * this.speed;
            if (this.x >= numCols) {
                this.x = this.initialX;
                this.delay = this.initDelay;
                this.isVisible = false;
            }
        }
    };
    this.render = function(engine) {
        if (this.isVisible === true) {
            engine.drawImage(this.sprite, this.x, this.y);
        }
    };
};
var Player = function(x, y) {
    Entity.call(this, x, y, sprite('images/char-boy_small.png', 0, -15, boundingBox(0.17, 0.36, 0.66, 0.46)));
    this.handleInput = function(keyCode, numRows, numCols) {
        switch (keyCode) {
            case 'left':
                if (this.x !== 0) {
                    this.x = this.x - 1;
                }
                break;
            case 'up':
                if (this.y !== 0) {
                    this.y = this.y - 1;
                }
                break;
            case 'right':
                if (this.x !== numCols - 1) {
                    this.x = this.x + 1;
                }
                break;
            case 'down':
                if (this.y !== numRows - 1) {
                    this.y = this.y + 1;
                }
                break;
        }
    };
};
var Mover = function(x, y, speed, delay, numCols) {
    Entity.call(this, x, y, sprite('images/log_small.png', 0, 0, defaultBoundingBox()));
    this.initialX = x;
    this.isVisible = false;
    this.delay = delay;
    this.initDelay = delay;
    this.speed = speed;
    this.update = function(dt) {
        if (this.delay > 0) {
            this.delay -= dt;
        } else {
            this.isVisible = true;
            this.x = this.x + dt * this.speed;
            if (this.x >= numCols) {
                this.x = this.initialX;
                this.delay = this.initDelay;
                this.isVisible = false;
            }
        }
    };
    this.render = function(engine) {
        if (this.isVisible === true) {
            engine.drawImage(this.sprite, this.x, this.y);
        }
    };
};