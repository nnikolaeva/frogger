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
    SpriteEntity.call(this, x, y, simpleSprite('images/water-block_small_1.png'));
};
var StoneBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/stone-block_small_1.png'));
};
var GrassBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/grass-block_small_1.png'));
};
var SelectorBlock = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/lock.png', 5, 25, defaultBoundingBox()));
};
var BlueGem = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/gem-blue_small_1.png', 10, 10, defaultBoundingBox())); 
    //SpriteEntity.call(this, x, y, simpleSprite('images/gem-blue_small.png')); 
    this.changePosition = function(numCols, numRols) {
        this.x = randValue(numCols);
        this.y = randValue(numCols);
    }; 
    function randValue(num) {
        return Math.round(Math.random() * num);
    }
};
var GreenGem = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/gem-green_small.png', 10, -20, defaultBoundingBox())); 
    this.changePosition = function(numCols, numRols) {
        this.x = randValue(numCols);
        this.y = randValue(numCols);
    }; 
    function randValue(num) {
        return Math.round(Math.random() * num);
    }
};
var OrangeGem = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/gem-orange_small.png', 10, -20, defaultBoundingBox())); 
    this.changePosition = function(numCols, numRols) {
        this.x = randValue(numCols);
        this.y = randValue(numCols);
    }; 
    function randValue(num) {
        return Math.round(Math.random() * num);
    }
};
var Key = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/key_small.png')); 
    this.moveToPlayerPanel = function(numCols, numRols) {
        this.x = 8;
        this.y = 16;
    }; 
    function randValue(num) {
        return Math.round(Math.random() * num);
    }
};
var Enemy = function(x, y, speed, delay, numCols) {
    SpriteEntity.call(this, x, y, sprite('images/enemy-bug_small_1.png', 0, -10, defaultBoundingBox()));
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
            engine.drawImage(this.sprite, this.x, this.y); // TODO: use method in superclass
        }
    };
};
var Player = function(x, y, numberOfLifes) {
    SpriteEntity.call(this, x, y, sprite('images/char-boy_small_1.png', 0, -5, boundingBox(0.17, 0.36, 0.66, 0.46)));
    this.initialX = x;
    this.initialY = y;
    this.numberOfLifes = numberOfLifes;
    this.score = 0;
    this.isKeyObtained = false;

    this.increaseScore = function(number) {
        this.score = this.score + number;
        console.log(this.score);
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
        if (this.y !== 0) {
            this.y = this.y - 1;
        }
    };
    this.moveDown = function(numCols, numRows) {
        console.log(numRows);
        console.log(this.y);
        if (this.y !== numRows - 1) {
            this.y = this.y + 1;
        }
    };
    this.moveLeft = function(numCols, numRows) {
        if (this.x !== 0) {
            this.x = this.x - 1;
        }
    };
    this.moveRight = function(numCols, numRows) {
        if (this.x !== numCols - 1) {
            this.x = this.x + 1;
        }
    };
    this.floating = function(entity) {
        this.x = entity.x;
        this.y = this.y;
        this.sprite.dy = -50;
    };
    this.obtainKey = function(key) {
        console.log("key");
        this.isKeyObtained = true;
        key.moveToPlayerPanel();

    };

};
var Life = function(x, y, count) {
    CompositeEntity.call(this, x, y);
    this.count = count;
    this.text = "x " + this.count;
    this.add(new SpriteEntity(this.x, this.y, sprite('images/heart_small_1.png', 0, 5, defaultBoundingBox())));
    //this.displayedText = new TextEntity(this.x + 1, this.y, "x " + count, this.color, "20px Gloria Hallelujah");
    this.displayedText = new TextEntity(x + 1, y + 1, this.text, this.color, "25px Gloria Hallelujah");

    this.add(this.displayedText);
    this.decreaseCount = function() {
        this.count --;
        this.displayedText.text = "x " + this.count;     
    };

};
// var Life = function(x, y, speed, delay, numCols) {
//     SpriteEntity.call(this, x, y, sprite('images/heart_small_1.png', 0, 5, defaultBoundingBox()));
//     this.isVisible = true;
//     this.render = function(engine) {
//         if (this.isVisible) {
//             engine.drawImage(this.sprite, this.x, this.y);
//         } else {
//             engine.drawRect(this.x, this.y, 1, 1);
//         }
//     };

// };
var Mover = function(x, y, speed, delay, numCols) {
    SpriteEntity.call(this, x, y, sprite('images/log_small_1.png', 0, 0, defaultBoundingBox()));
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
var CounterMover = function(x, y, speed, delay, numCols) {
    Mover.call(this, x, y, speed, delay, numCols);
    this.update = function(dt) {
        if (this.delay > 0) {
            this.delay -= dt;
        } else {
            this.isVisible = true;
            this.x = this.x - dt * this.speed;
            if (this.x < 0) {
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

