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
var Menu = function() {
    CompositeEntity.call(this, 0, 0);
    this.add(new FullScreenRectangleEntity());
    //this.add(new RectangleEntity(this.x, this.y, this.width, this.height));
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

var StartMenu = function(startButtonCallback, configButtonCallBack) {
    Menu.call(this);
    this.add(new TextEntity(4, 4, "Frogger", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(7, 9, "start", startButtonCallback));
    this.add(new Button(7, 11, "config", configButtonCallBack));
};

var PauseMenu = function(resumeButtonCallback, startMenuButtonCallback) {
    Menu.call(this);
    this.add(new TextEntity(4, 4, "Paused", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(7, 9, "resume game", resumeButtonCallback));
    this.add(new Button(7, 11, "main menu", startMenuButtonCallback));
};

var GameOverMenu = function(startButtonCallback, configButtonCallBack) {
    Menu.call(this);
    this.add(new TextEntity(4, 4, "Game Over :(", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(7, 9, "try again", startButtonCallback));
    this.add(new Button(7, 11, "config", configButtonCallBack));
};

var WinMenu = function(startButtonCallback, configButtonCallBack) {
    Menu.call(this);
    this.add(new TextEntity(4, 4, "Congrats!", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(7, 9, "play again", startButtonCallback));
    this.add(new Button(7, 11, "config", configButtonCallBack));
};

var ConfigMenu = function(config, startButtonCallback) {
    Menu.call(this);
    this.add(new TextEntity(2, 4, "Select Difficulty", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Slider(4, 6, "enemy speed", assertDefined(config.enemy.speed)));
    this.add(new Slider(4, 7, "enemy count", assertDefined(config.enemy.num)));
    this.add(new Slider(4, 8, "enemy delay", assertDefined(config.enemy.delay)));
    this.add(new Slider(4, 9, "transport speed", assertDefined(config.transport.speed)));
    this.add(new Slider(4, 10, "transport count", assertDefined(config.transport.num)));
    this.add(new Slider(4, 11, "transport delay", assertDefined(config.transport.delay)));
    this.add(new Slider(4, 12, "exit count", assertDefined(config.exit.num)));
    this.add(new Button(15, 15, "start", startButtonCallback));
};
var LevelMenu = function(easyButtonCallback, mediumButtonCallback, configButtonCallBack) {
    Menu.call(this);
    this.add(new TextEntity(4, 4, "Select Difficulty Level", this.color, "bold 100px Gloria Hallelujah"));
    this.add(new Button(7, 9, "easy", easyButtonCallback));
    this.add(new Button(7, 11, "medium", mediumButtonCallback));
    this.add(new Button(7, 13, "customize", configButtonCallBack));
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
var Slider = function(x, y, label, config) {
    Control.call(this, x, y);
    this.label = label + ": ";
    this.barLength = 6;
    this.barWidth = 2;
    this.barX = this.x + 6;
    this.barY = this.y;
    this.min = config.range[0];
    this.max = config.range[1];
    this.pointerRadius = 8;
    this.poiterStep = this.barLength / this.max;
    this.poiterX = this.barX + config.value * this.poiterStep;

    var displayedText = new TextEntity(this.x, this.y, this.label + config.value, this.color, "25px Gloria Hallelujah");
    var pointer = new CircleEntity(this.poiterX, this.barY, this.pointerRadius, this.color);

    // add components to slider components array
    this.add(displayedText);
    this.add(new LineEntity(this.barX, this.barY, this.barX + this.barLength, this.barY, this.barWidth, this.color));
    this.add(pointer);

    // change config and pointer position if config value is not equal min value
    this.onLeft = function() {
        if (config.value > this.min) {
            config.value -= config.step;
            pointer.x -= this.poiterStep;
            displayedText.text = this.label + config.value;
        }
    };
    this.onRight = function() {
        if (config.value < this.max) {
            config.value += config.step;
            pointer.x += this.poiterStep;
            displayedText.text = this.label + config.value;
        }
    };





    

    
};