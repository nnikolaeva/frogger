var config = {
        "enemy": {
            "speed": {
                "range": [0, 15],
                "value": 7,
                "step": 1,
                "level": [2, 7, 12]
            },
            "num": {
                "range": [0, 40],
                "value": 20,
                "step": 2,
                "level": [10, 20, 30]
            },
            "delay": {
                "range": [0, 5],
                "value": 1,
                "step": 1,
                "level": [0, 1, 2]
            }
        },
        "transport": {
            "speed": {
                "range": [0, 15],
                "value": 2,
                "step": 1,
                "level": [1, 2, 6]
            },
            "num": {
                "range": [8, 50],
                "value": 26,
                "step": 2,
                "level": [30, 26, 14]
            },
            "delay": {
                "range": [0, 5],
                "value": 1,
                "step": 1,
                "level": [0, 1, 3]
            }
        },
        "exit": {
            "num": {
                "range": [1, 10],
                "value": 3,
                "step": 1,
                "level": [5, 3, 1]
            }
        },
        "key": {
            "num": {
                "range": [0, 10],
                "value": 3,
                "step": 1,
                "level": [1, 3, 5]
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
