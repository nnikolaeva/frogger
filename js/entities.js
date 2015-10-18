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
    this.color = "black";
    this.render = function(engine) {
        engine.drawRect(x, y, width, height, this.color);
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
var Button = function(x, y, text) {
    TextEntity.call(this, x, y, text, "#009900", "bold 50px Gloria Hallelujah");
    this.selected = false;
    this.selectedColor = "#CCFF33";
    this.notSelectedColor = "#009900";

    this.isSelected = function() {
        return this.selected;
    };
    this.deselect = function() {

        this.selected = false;
        this.color = this.notSelectedColor;
    }
    this.select = function() {
        this.selected = true;
        this.color = this.selectedColor;
        console.log(this.color);
    }
    this.onClick;
    this.selector = new TextEntity(this.x - 2, y, "->", this.selectedColor, "bold 50px Gloria Hallelujah");
    this.render = function(engine) {
        if (this.isSelected()) {
            this.selector.render(engine);
        }
        engine.drawText(this.x, this.y, this.text, this.color, this.font);
    };
}; 
var Menu = function(x, y, width, height) {
    RectangleEntity.call(this, x, y, width, height);
    this.buttons = [];
    this.addButton = function(button) {
        this.buttons.push(button);
        if (this.buttons.length === 1) {
            button.select();
        }
    };
    this.render = function(engine) {
        engine.drawRect(x, y, width, height, this.color);
        for (var i in this.buttons) {
            this.buttons[i].render(engine);
        }
    };
    
    this.handleEnterInput = function() {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].selected === true) {
                this.buttons[i].onClick();
            }
        }
    };
    this.handleUpInput = function() {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].isSelected() && i > 0) {
                this.buttons[i].deselect();
                this.buttons[i - 1].select();
            }
        }
    };
    this.handleDownInput = function() {
         for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].isSelected() && i < this.buttons.length - 1) {
                this.buttons[i].deselect();
                this.buttons[i + 1].select();
            }
        }
    }

};

// var Button = function(x, y, width, height, name) {
//     RectangleEntity.call(this, x, y, width, height);
//     this.selectedColor = "yellow";
//     this.color = "grey";
//     this.notSelectedColor = "grey";
//     this.name = name;
//     this.selected = false;
//     this.label = new TextEntity(x, y + 1, this.name, this.color, "50px Gloria Hallelujah");
//     this.isSelected = function() {
//         return this.selected;
//     };
//     this.deselect = function() {
//         this.selected = false;
//         //this.color = this.notSelectedColor;
//         this.label.color = this.notSelectedColor;
//     }
//     this.select = function() {
//         this.selected = true;
//         //this.color = this.selectedColor;
//         this.label.color = this.selectedColor;
//     }
//     this.onClick;
//     this.addOnClickHandler = function(handler) {
//         this.onClick = handler;
//     }
//     this.render = function(engine) {
//         //engine.drawStrokeRect(x, y, width, height, this.color);
//         this.label.render(engine);

//     }
// };


var WaterBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/water-block_small.png'));
};
var StoneBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/stone-block_small.png'));
};
var GrassBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/grass-block_small.png'));
};
var SelectorBlock = function(x, y) {
    SpriteEntity.call(this, x, y, simpleSprite('images/star_small.png'));
};
var Enemy = function(x, y, speed, delay, numCols) {
    SpriteEntity.call(this, x, y, sprite('images/enemy-bug_small.png', 0, -10, defaultBoundingBox()));
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
    SpriteEntity.call(this, x, y, sprite('images/char-boy_small.png', 0, -15, boundingBox(0.17, 0.36, 0.66, 0.46)));
    this.initialX = x;
    this.initialY = y;
    this.numberOfLifes = numberOfLifes;

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
    // this.handleInput = function(keyCode, numRows, numCols) {
    //     switch (keyCode) {
    //         case 'left':
    //             if (this.x !== 0) {
    //                 this.x = this.x - 1;
    //             }
    //             break;
    //         case 'up':
    //             if (this.y !== 0) {
    //                 this.y = this.y - 1;
    //             }
    //             break;
    //         case 'right':
    //             if (this.x !== numCols - 1) {
    //                 this.x = this.x + 1;
    //             }
    //             break;
    //         case 'down':
    //             if (this.y !== numRows - 1) {
    //                 this.y = this.y + 1;
    //             }
    //             break;
    //     }
    // };
    this.moveUp = function(numRows, numCols) {
   if (this.y !== 0) {
                    this.y = this.y - 1;
                }
};
this.moveDown = function(numRows, numCols) {
    if (this.y !== numRows - 1) {
                    this.y = this.y + 1;
                }
};
this.moveLeft = function(numRows, numCols) {
    if (this.x !== 0) {
                    this.x = this.x - 1;
                }
};
this.moveRight = function(numRows, numCols) {
   if (this.x !== numCols - 1) {
                    this.x = this.x + 1;
                }
};

};




var Life = function(x, y, speed, delay, numCols) {
    SpriteEntity.call(this, x, y, sprite('images/heart_small.png', 0, 0, defaultBoundingBox()));
    this.isVisible = true;
    this.render = function(engine) {
        if (this.isVisible) {
            engine.drawImage(this.sprite, this.x, this.y);
        } else {
            engine.drawRect(this.x, this.y, 1, 1);
        }
    };

};
var Mover = function(x, y, speed, delay, numCols) {
    SpriteEntity.call(this, x, y, sprite('images/log_small.png', 0, 0, defaultBoundingBox()));
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