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

var TextEntity = function(x, y, text, color, font) {
    Entity.call(this, x, y);
    this.text = text;
    this.color = color;
    this.font = font;
    this.render = function(engine) {
        engine.drawText(this.x, this.y, this.text, this.color, this.font);
    };
};
var Timer = function(x, y, text, color, font, seconds) {
    TextEntity.call(this, x, y, text, color, font);
    this.seconds = seconds;
    this.counter = new TextEntity(x + 1, y, this.seconds, color, font);
    this.square = new RectangleEntity(x, y - 1, 2, 1);
    this.update = function(dt) {
        this.seconds -= dt;
        this.counter.text = Math.floor(this.seconds);
    };
    this.render = function(engine) {
        this.square.render(engine);
        engine.drawText(this.x, this.y, this.text, this.color, this.font);
        this.counter.render(engine);

    };
    
};

var Control = function(x, y) {
    CompositeEntity.call(this, x, y);
    this.selected = false;
    this.selectedColor = "#CCFF33";
    this.selectionSymbol = new TextEntity(this.x - 2, y, "->", "#CCFF33", "bold 50px Gloria Hallelujah");
    this.isSelected = function() {
        return this.selected;
    };
    this.changeColor = function(color) {
        for (var i in this.components) {
            this.components[i].color = color;
        }
    };
    this.select = function() {
        this.selected = true;
        this.components.push(this.selectionSymbol);
        this.changeColor(this.selectedColor);

    };
    this.deselect = function() {
        this.selected = false;
        this.components.pop();
        this.changeColor(this.color);
    };
};

this.Button = function(x, y, text, callback) {
    Control.call(this, x, y);
    this.label = text;
    this.add(new TextEntity(x, y, text, this.color, "bold 50px Gloria Hallelujah"));
    this.onClick = callback;
};
this.Slider = function(x, y, label, value, max, leftCallback, rightCallback, easyValue, mediumValue, hardValue, nightmareValue) {
    Control.call(this, x, y);
    this.maxValue = max;
    this.easyValue = easyValue;
    this.mediumValue = mediumValue;
    this.hardValue = hardValue;
    this.nightmareValue = nightmareValue;
    this.length = 6;
    this.radius = 10;
    this.value = value;
    this.onLeft = leftCallback;
    this.onRight = rightCallback;
    this.step = this.length / this.maxValue;
    this.updateToEasyLevel = function() {
        for (var i in this.components) {
            if (this.components[i] === sliderPoint) {
                this.components[i].x = this.x + 4 + (this.easyValue - 2) * this.length / this.maxValue;
            } 
            if (this.components[i] === value) {
                this.components[i].text = this.easyValue;
            }
        }
    };
    this.updateToMediumLevel = function() {
        for (var i in this.components) {
            if (this.components[i] === sliderPoint) {
                this.components[i].x = this.x + 4 + (this.mediumValue - 2) * this.length / this.maxValue;
            } 
            if (this.components[i] === value) {
                this.components[i].text = this.mediumValue;
            }
        }

    };
    this.updateToHardLevel = function() {
        for (var i in this.components) {
            if (this.components[i] === sliderPoint) {
                this.components[i].x = this.x + 4 + (this.hardValue - 2) * this.length / this.maxValue;
            } 
            if (this.components[i] === value) {
                this.components[i].text = this.hardValue;
            }
        }

    };
    this.updateToNightmareLevel = function() {
        for (var i in this.components) {
            if (this.components[i] === sliderPoint) {
                this.components[i].x = this.x + 4 + (this.nightmareValue - 2) * this.length / this.maxValue;
            } 
            if (this.components[i] === value) {
                this.components[i].text = this.nightmareValue;
            }
        }

    };
    this.moveLeft = function() {
        console.log(this.value);
        this.value -= 1;
        console.log(this.value);
        for (var i in this.components) {
            if (this.components[i] === sliderPoint) {
                this.components[i].x -= this.step;
            } 
            if (this.components[i] === value) {
                this.components[i].text = this.value;
            }
        }
    };
    this.moveRight = function() {
        console.log(this.value);
        this.value += 1;
        console.log(this.value);
        for (var i in this.components) {
            if (this.components[i] === sliderPoint) {
                this.components[i].x += this.step;
            } 
            if (this.components[i] === value) {
                this.components[i].text = this.value;
            }
        }
    };
    this.dx = (this.value - 2) * this.length / this.maxValue;
    this.add(new TextEntity(x, y, label, this.color, "bold 50px Gloria Hallelujah"));
    var value = new TextEntity(x + 3, y, this.value, this.color, "bold 50px Gloria Hallelujah");
    this.add(value);
    this.add(new LineEntity(this.x + 4, this.y, this.x + 4 + this.length , this.y, 5, this.color));
    var sliderPoint = new CircleEntity(this.x + 4 + this.dx, this.y, this.radius, this.color);
    this.add(sliderPoint);
};
// this.Slider = function() {
//     Control.call(this, x, y);

// };


var CompositeEntity = function(x, y) {
    Entity.call(this, x, y);
    this.components = [];
    this.add = function(entity) {
        this.components.push(entity);
    };
    this.render = function(engine) {
        for (var i in this.components) {
            this.components[i].render(engine);
        }
    };
}; 

var Menu = function(x, y, width, height) {
    CompositeEntity.call(this, x, y);
    this.add(new RectangleEntity(0, 0, width, height));
    this.add(new TextEntity(3, 16, "use the arrow keys to navigate and Enter to select the item", this.color, "20px Gloria Hallelujah"));
    this.controls = [];
    this.add = function(entity) {
        this.components.push(entity);
        if (entity instanceof Button || entity instanceof Slider) {
            this.controls.push(entity);
            if (this.controls.length === 1) {
                entity.select();
            }
        }
    };
    this.handleUp = function() {
        console.log("up");
        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i].isSelected() && i > 0) {
                this.controls[i].deselect();
                this.controls[i - 1].select();
            }
        }
    };
    this.handleDown = function() {
        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i].isSelected() && i < this.controls.length - 1) {
                this.controls[i].deselect();
                this.controls[i + 1].select();
                break;
            }
        }        
    };
    this.getSelectedControl = function() {
        console.log(this.controls);
        var control;
        for (var i in this.controls) {
            control = this.controls[i];
            if (control.isSelected()) {
                return control;
            }
        }
    };
    this.handleEnter = function() {
        var control = this.getSelectedControl(); //add check if onClick not null
        control.onClick();
    };
    this.handleLeft = function() {
        var control = this.getSelectedControl();
        control.onLeft();
    };
    this.handleRight = function() {
        var control = this.getSelectedControl();
        control.onRight();
    };
};

var StartMenu = function(width, height, startButtonCallback, configButtonCallBack) {
    Menu.call(this, 0, 0, width, height);
    this.add(new TextEntity(4, 4, "Frogger", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(7, 9, "start", startButtonCallback));
    this.add(new Button(7, 11, "config", configButtonCallBack));
};

var ConfigMenu = function(width, height, startEasyButtonCallback, startMediumButtonCallback, startButtonCallback, config, leftCallback, rightCallback, enemyLeftCallback, enemyRightCallback, startHardButtonCallback, startNightmareButtonCallback) {
    Menu.call(this, 0, 0, width, height);
    this.updateAllSliders = function(label) {
        for (var i in this.controls) {
            if (this.controls[i] instanceof Slider) {
                if (label === "easy") {
                    this.controls[i].updateToEasyLevel();    
                } else if (label === "medium") {
                    this.controls[i].updateToMediumLevel();    
                } else if (label === "hard") {
                    this.controls[i].updateToHardLevel();    
                } else if (label === "nightmare") {
                    this.controls[i].updateToNightmareLevel();    
                }
                
            }
        }
    };
    this.handleEnter = function() {
        var control = this.getSelectedControl(); //add check if onClick not null
        control.onClick();
        if (control instanceof Button) {
                    this.updateAllSliders(control.label);
                }
        

    };
    this.add(new TextEntity(2, 4, "Select Difficulty", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(4, 7, "easy", startEasyButtonCallback));
    this.add(new Button(4, 9, "medium", startMediumButtonCallback));
    this.add(new Button(11, 7, "hard", startHardButtonCallback));
    this.add(new Button(11, 9, "nightmare", startNightmareButtonCallback));
    this.add(new Button(15, 14, "start", startButtonCallback));
    this.add(new Slider(5, 11, "speed", config.getSpeed(), 12, leftCallback, rightCallback, config.getSpeedEasyValue(), config.getSpeedMediumValue(), config.getSpeedHardValue(), config.getSpeedNightmareValue()));
    this.add(new Slider(5, 13, "enemy", config.getEnemiesNum(), 12, enemyLeftCallback, enemyRightCallback, config.getEnemyEasyValue(), config.getEnemyMediumValue(), config.getEnemyHardValue(), config.getEnemyNightmareValue()));

    
    // this.handleUp = function() {
    //     console.log("up");
    //     for (var i = 0; i < this.controls.length; i++) {
    //         if (this.controls[i].isSelected() && i > 0) {
    //             this.controls[i].deselect();
    //             this.controls[i - 1].select();
    //             if (this.controls[i - 1] instanceof Button) {
    //                 this.updateAllSliders(this.controls[i - 1].label);
    //             }
    //         }
    //     }
    // };
    // this.handleDown = function() {
    //     for (var i = 0; i < this.controls.length; i++) {
    //         if (this.controls[i].isSelected() && i < this.controls.length - 1) {
    //             this.controls[i].deselect();
    //             this.controls[i + 1].select();
    //             if (this.controls[i + 1] instanceof Button) {
    //                 this.updateAllSliders(this.controls[i + 1].label);
    //             }
    //             break;
    //         }
    //     }        
    // };

};

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
var BlueGem = function(x, y) {
    SpriteEntity.call(this, x, y, sprite('images/gem-blue_small.png', 10, -20, defaultBoundingBox())); 
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
    SpriteEntity.call(this, x, y, sprite('images/char-boy_small.png', 0, 0, boundingBox(0.17, 0.36, 0.66, 0.46)));
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

