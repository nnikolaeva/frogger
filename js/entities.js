/* entities.js file provides all entities classes for game.
 */
var BackgroundBlock = function(sprite, x, y) {
	this.x = x;
	this.y = y;
	this.sprite = {image: sprite, dx: 0, dy: 0, bbox: {x: 0, y: 0, w: 1, h: 1}};
	this.update = function() {

	}
	this.render = function(engine) {
		engine.drawImage(this.sprite, this.x, this.y);
	}
}
var WaterBlock = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = {image: 'images/water-block.png', dx: 0, dy: 0, bbox: {x: 0, y: 0, w: 1, h: 1}};
	this.update = function() {
	}
	this.render = function(engine) {
		engine.drawImage(this.sprite, this.x, this.y);
	}
}
var StoneBlock = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = {image: 'images/stone-block.png', dx: 0, dy: 0, bbox: {x: 0, y: 0, w: 1, h: 1}};
	this.update = function() {
	}
	this.render = function(engine) {
		engine.drawImage(this.sprite, this.x, this.y);
	}
}
var GrassBlock = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = {image: 'images/grass-block.png', dx: 0, dy: 0, bbox: {x: 0, y: 0, w: 1, h: 1}};
	this.update = function() {
	}
	this.render = function(engine) {
		engine.drawImage(this.sprite, this.x, this.y);
	}
}
var Enemy = function(x, y, speed, delay, numCols) {
	this.initialX = x;
	this.isVisible = false;
	this.delay = delay;
	this.initDelay = delay;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = {image: 'images/enemy-bug.png', dx: 0, dy: -20, bbox: {x: 0, y: 0, w: 1, h: 1}};
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
    }

    this.render = function(engine) {
    	if (this.isVisible === true) {
    		engine.drawImage(this.sprite, this.x, this.y);
    	}
    }
    this.setX = function(x) {
    	this.x = x;
    }
    this.setY = function(y) {
    	this.y = y;
    }
}
var Player = function(x,y) {
    this.x = x;
    this.y = y;
    this.setX = function(x) {
    	this.x = x;
    }
    this.setY = function(y) {
    	this.y = y;
    }
    this.sprite = {image: 'images/char-boy.png', dx: 0, dy: -30, bbox: {x: 0.17, y: 0.36, w: 0.66, h: 0.46}};
    this.update = function() {

    }
    this.render = function(engine) {
    	engine.drawImage(this.sprite, this.x, this.y);
    }
    this.handleInput = function(keyCode, numRows, numCols) {
    	switch (keyCode) {
        case 'left':
        if (this.x !== 0) {
        this.x = this.x - 1;
        }
        break;
        case 'up':
        if(this.y !== 0) {
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
    }
}
