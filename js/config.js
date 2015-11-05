var config = {
        "enemy": {
            "speed": {
                "range": [0, 14],
                "value": 1,
                "step": 1,
                "level": [2, 6, 10, 14]
            },
            "num": {
                "range": [0, 20],
                "value": 10,
                "step": 1,
                "level": [2, 6, 10, 14]
            },
            "delay": {
                "range": [0, 2],
                "value": 1,
                "step": 1,
                "level": [0, 1, 2, 2]
            }
        },
        "transport": {
            "speed": {
                "range": [0, 14],
                "value": 3,
                "step": 1,
                "level": [2, 6, 10, 14]
            },
            "num": {
                "range": [0, 20],
                "value": 25,
                "step": 1,
                "level": [2, 6, 10, 14]
            },
            "delay": {
                "range": [0, 2],
                "value": 1,
                "step": 1,
                "level": [0, 0, 1, 2]
            }
        },
        "exit": {
            "num": {
                "range": [1, 10],
                "value": 5,
                "step": 1,
                "level": [2, 6, 10, 14]
            }
        },
        "key": {
            "num": {
                "range": [1, 10],
                "value": 2,
                "step": 1,
                "level": [2, 6, 10, 14]
            }
        }
    };

    var assertDefined = function(value) {
        if (typeof value === "undefined") {
            throw "Value is not defined";
        }
        return value;
    };

    var setConfigToLevel = function(levelNum) {
        for (var i in config) {
            if (config.hasOwnProperty(i)) {
                var entity = config[i];
                for (var j in entity) {
                    if (entity.hasOwnProperty(j)) {
                        var conf = entity[j];
                        conf.value = conf.level[levelNum];
                    }
                }

            }
        }
    };
