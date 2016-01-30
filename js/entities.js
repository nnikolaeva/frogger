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

var Entity = function(x, y) {
    this.x = x;
    this.y = y;
    this.color = "#009900";
    this.update = function() {};
};

var SpriteEntity = function(x, y, sprite) {
    Entity.call(this, x, y);
    this.sprite = sprite;
    this.render = function(engine) {
        engine.drawImage(this.sprite, this.x, this.y);
    };
};

var RectangleEntity = function(x, y, width, height) {
    Entity.call(this, x, y);
    this.width = width;
    this.height = height;
    this.color = "rgba(0, 0, 0, 0.1)";
    this.render = function(engine) {
        engine.drawRect(x, y, width, height, this.color);
    };
};

var FullScreenRectangleEntity = function() {
    Entity.call(this, 0, 0);
    this.color = "rgba(0, 0, 0, 0.1)";
    this.render = function(engine) {
        engine.drawFullScreenRect(this.color);
    };
};

var TextEntity = function(x, y, text, color, font) {
    Entity.call(this, x, y);
    this.text = text;
    this.color = color;
    this.font = font;
    this.render = function(engine) {
        engine.drawText(this.x, this.y, this.text, this.color, this.font);
    };
};
var Timer = function(x, y, seconds) {
    CompositeEntity.call(this, x, y);
    this.seconds = seconds;
    this.text = "Time: " + this.seconds;
    this.displayedText = new TextEntity(x, y, this.text, this.color, "25px Gloria Hallelujah");
    this.add(this.displayedText);
    this.update = function(dt) {
        this.seconds -= dt;
        this.displayedText.text = "Time: " + Math.floor(this.seconds);
    };

};

var WaterBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/water-block.png'));
};
var StoneBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/stone-block.png'));
};
var GrassBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/grass-block.png'));
};
var SelectorBlock = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/lock.png', 5, 25, defaultBoundingBox()));
};
var Bonus = function(sprite, numCols, numRows) {
    this.x = randValue(numCols);
    this.y = randValue(numRows);
    SpriteEntity.call(this, this.x, this.y, sprite);
    this.visible = false;
    this.initialDelay = randValue(5);
    this.delay = this.initialDelay;
    this.initialLifeTime = 15;
    this.lifeTime = this.initialLlifeTime;

    this.setDelay = function(delay) {
        this.initialDelay = delay;
        this.delay = delay;
    };

    function randValue(num) {
        return Math.round(Math.random() * num);
    }
    this.changePosition = function() {
        this.visible = false;
        this.x = randValue(numCols);
        this.y = randValue(numRows) + 1;
        this.delay = this.initialDelay;
        this.lifeTime = this.initialLifeTime;
    };
    this.update = function(dt) {
        if (this.delay > 0) {
            this.delay -= dt;
        } else {
            this.visible = true;
            if (this.lifeTime > 0) {
                this.lifeTime -= dt;
            } else {
                this.changePosition();
            }
        }
    };
    this.render = function(engine) {
        if (this.visible) {
            engine.drawImage(this.sprite, this.x, this.y);
        }
    };
};

var BlueGem = function(numCols, numRows) {
    Bonus.call(this, sprite('images/gem-blue.png', 10, 10, defaultBoundingBox()), numCols, numRows);
    this.bonusNumber = 10;
};
var GreenGem = function(numCols, numRows) {
    Bonus.call(this, sprite('images/gem-green.png', 10, 10, defaultBoundingBox()), numCols, numRows);
    this.bonusNumber = 20;
};
var OrangeGem = function(numCols, numRows) {
    Bonus.call(this, sprite('images/gem-orange.png', 10, 10, defaultBoundingBox()), numCols, numRows);
    this.bonusNumber = 30;
};
var Life = function(numCols, numRows) {
    Bonus.call(this, sprite('images/heart.png', 10, 10, defaultBoundingBox()), numCols, numRows);

};

var Key = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/key.png', 0, 5, boundingBox(0, 0.5, 1, 1)));
    this.isNotPicked = true;
    this.changeState = function() {
        this.sprite.dy = -5;
        this.x = 3;
        this.y = 19;
    };
};

var Enemy = function(x, y, speed, delay, numCols, image) {
    SpriteEntity.call(this, x, y, sprite(image, 0, -10, boundingBox(0, 0.5, 1, 1)));
    this.initialX = x;
    this.isVisible = false;
    this.delay = delay;
    this.initDelay = delay;
    this.speed = speed;
    this.wasFloating = false;
    this.update = function(dt) {
        if (this.delay > 0) {
            this.delay -= dt;
        } else {
            this.isVisible = true;
            this.x = this.x + dt * this.speed;
            if ((this.speed > 0 && this.x >= numCols) || (this.speed < 0 && this.x < -1)) {
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

var EnemyLeftToRight = function(x, y, speed, delay, numCols) {
    Enemy.call(this, x, y, speed, delay, numCols, "images/enemy-bug.png");
};

var EnemyRightToLeft = function(x, y, speed, delay, numCols) {
    Enemy.call(this, x, y, speed, delay, numCols, "images/enemy-bug_flipped.png");
};

var Player = function(x, y, numberOfLifes, numCols, numRows) {
    SpriteEntity.call(this, x, y, sprite('images/char-boy.png', 0, -5, boundingBox(0.17, 0.36, 0.66, 0.46)));
    this.initialX = x;
    this.initialY = y;
    this.numberOfLifes = numberOfLifes;
    this.score = 0;
    this.isKeyObtained = false;
    this.inWater = false;
    this.floatOutOfScreen;

    this.setfloatOutOfScreenCallback = function(callback) {
        this.floatOutOfScreen = callback;
    };

    this.increaseScore = function(number) {
        this.score = this.score + number;
    };

    this.changePositionToInitial = function() {
        this.x = this.initialX;
        this.y = this.initialY;
    };
    this.decreaseLifeCounter = function() {
        this.numberOfLifes = this.numberOfLifes - 1;
    };
    this.isAlive = function() {
        if (this.numberOfLifes > 0) {
            return true;
        }
        return false;
    };

    this.moveUp = function(numCols, numRows) {
        if (this.wasFloating) {
            this.x = Math.floor(this.x);
            this.wasFloating = false;
        }
        if (this.y !== 0) {
            this.y = this.y - 1;
        }
    };
    this.moveDown = function(numCols, numRows) {
        if (this.wasFloating) {
            this.x = Math.floor(this.x);
            this.wasFloating = false;
        }

        if (this.y !== numRows - 1) {
            this.y = this.y + 1;
        }
    };
    this.moveLeft = function(numCols, numRows) {
        if (this.wasFloating) {
            this.wasFloating = false;
        }
        if (this.x !== 0) {
            this.x = this.x - 1;
        }
    };
    this.moveRight = function(numCols, numRows) {
        if (this.wasFloating) {
            this.wasFloating = false;
        }
        if (this.x !== numCols - 1) {
            this.x = this.x + 1;
        }
    };
    this.floating = function(entity) {
        this.wasFloating = true;
        this.x = entity.x;
        this.y = entity.y;
        if (this.x < -1 || this.x > numCols) {
            this.floatOutOfScreen();
        }
    };
    this.obtainKey = function(key) {
        this.isKeyObtained = true;

    };
};
var LifeCounter = function(x, y, count) {
    CompositeEntity.call(this, x, y);
    this.count = count;
    this.text = "x " + this.count;
    this.add(new SpriteEntity(this.x, this.y, sprite('images/heart.png', 0, -5, defaultBoundingBox())));
    this.displayedText = new TextEntity(x + 1, y + 1, this.text, this.color, "25px Gloria Hallelujah");
    this.add(this.displayedText);
    this.decreaseCount = function() {
        this.count --;
        this.displayedText.text = "x " + this.count;
    };
    this.increaseCount = function() {
        this.count ++;
        this.displayedText.text = "x " + this.count;
    };

};

var KeyCounter = function(x, y, count) {
    CompositeEntity.call(this, x, y);
    this.currentKeyCount = 0;
    this.requiredKeyCount = count;
    this.text = this.currentKeyCount + " / " + this.requiredKeyCount;
    this.add(new SpriteEntity(this.x, this.y, sprite('images/key.png', 0, -5, boundingBox(0, 0.5, 1, 1))));
    this.displayedText = new TextEntity(x + 1, y + 1, this.text, this.color, "25px Gloria Hallelujah");

    this.add(this.displayedText);
    this.changeCounter = function() {
        this.currentKeyCount ++;
        this.displayedText.text = this.currentKeyCount + " / " + this.requiredKeyCount;
    };

};

var ScoreCounter = function(x, y) {
    CompositeEntity.call(this, x, y);
    this.count = 0;
    this.text = "Score: " + this.count;
    this.displayedText = new TextEntity(x + 1, y + 1, this.text, this.color, "25px Gloria Hallelujah");
    this.add(this.displayedText);
    this.changeCounter = function(num) {
        this.count += num;
        this.displayedText.text = "Score: " + this.count;
    };

};

var TransportPart = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/log.png', 0, 35, boundingBox(0.3, 0, 0.3, 0.3)));
};

var Transport = function(x, y, numCols, delay, speed, length) {
    CompositeEntity.call(this, x, y);
    for (var i = 0; i < length; i++) {
        this.add(new TransportPart(x - i, y));
    }
    this.initialX = x;
    this.isVisible = false;
    this.delay = delay;
    this.initDelay = delay;
    this.speed = speed;
    this.changeComponentsX = function(x) {
        var first;
        for (var j = 0; j < this.components.length; j++) {
            if (j === 0) {
                first = this.components[j];
                first.x = x;
            } else {
                this.components[j].x = first.x - j;
            }
        }
    };
    this.update = function(dt) {
        if (this.delay > 0) {
            this.delay -= dt;
        } else {
            this.isVisible = true;
            this.x += dt * this.speed;
            this.changeComponentsX(this.x);

            if ((this.speed > 0 && this.x >= numCols + this.components.length) || (this.speed < 0 && this.x < -1)) {
                this.changeComponentsX(this.initialX);
                this.x = this.initialX;
                this.delay = this.initDelay;
                this.isVisible = false;
            }
        }
    };
};

var LineEntity = function(x, y, x1, y1, width, color) {
    Entity.call(this, x, y);
    this.x1 = x1;
    this.y1 = y1;
    this.color = color;
    this.render = function(engine) {
        engine.drawLine(this.x, this.y, this.x1, this.y1, width, this.color);
    };
};

var CircleEntity = function(x, y, radius, color) {
    Entity.call(this, x, y);
    this.radius = radius;
    this.color = color;
    this.render = function(engine) {
        engine.drawCircle(this.x, this.y, this.radius, this.color);
    };
};