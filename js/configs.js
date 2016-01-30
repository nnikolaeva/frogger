var assertDefined = function(x) {
	if (x === undefined) {
		throw "value is not defined";
	}
	return x;
};

var defined = assertDefined;

var Config = function(map) {
	this.enemy = new EnemyConfig(map.enemy);
	this.enemy = enemy;
	this.transport = transport;

};

var EnemyConfig = function(map) {
	this.num = new ConfigValue(map.num);
	this.num = new ConfigValue();
	this.speed = new ConfigValue();
	this.delay = new ConfigValue();
};

var ConfigValue = function(map) {
	this.value = defined(map.value);
	this.min = defined(map.range[0]);
	this.max = defined(map.range[1]);
};

var config = new Config(
	new EnemyConfig(
		new ConfigValue(0, 20, 10) /* num */,
		new ConfigValue(0, 14, 7) /* speed */,
		new ConfigValue(0, 2, 1) /* delay */),
	new TransportConfig(
		new ConfigValue(0, 20, 10),
		new ConfigValue(0, 14, 7),
		new ConfigValue(0, 2, 1)));

var config = {
	enemyConfig: {
		speed: {
			range: [0, 14],
			value: 7 
		},
		num: {
			range: [0, 20],
			value: 10
		},
		delay: {
			range: [0, 2],
			value: 1
		}

	}
};

var config = new ConfigBuilder()
	.withEnemyConfig(
		new EnemyConfigBuilder()
			.withEnemyCount(new ConfigValue(0, 20, 10))
			.withSpeed(new ConfigValue(0, 14, 7))
			.withDelay(new ConfigValue(0, 2, 1))
			.build())
	.withTransportConfig(
		new TransportConfigBuilder()
			.withTransportCount(new ConfigValue(0, 20, 10))
			.withSpeed(new ConfigValue(0, 14, 7))
			.withDelay(new ConfigValue(0, 2, 1))
			.build())
	.build();

var ConfigBuilder = function() {
	this.from = function(b) {
		this.enemyConfig = b.enemyConfig;
		this.transportConfig = b.transportConfig;
	};
	this.withEnemyConfig = function(enemyConfig) {
		this.enemyConfig = assertDefined(enemyConfig);
		return this;
	};
	this.withTransportConfig = fucntion(transportConfig) {
		this.transportConfig = assertDefined(transportConfig);
		return this;
	}
	this.build = function() {
		return new Config(assertDefined(enemyConfig), assertDefined(transportConfig));
	};
};