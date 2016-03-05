var WaterSkillGame;
(function (WaterSkillGame) {
    var Game = (function () {
        function Game(width, height) {
            this.width = width;
            this.height = height;
        }
        Game.prototype.run = function (container, apiDomain, loadedCallback) {
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, container, WaterSkillGame.States.MainState);
            this.game.apiDomain = apiDomain;
            this.game.stateLoadedCallback = loadedCallback;
        };
        Game.prototype.setJackpotItemsArray = function (array, maxItems) {
            var state = this.game.state.getCurrentState();
            if (state) {
                state.setJackpotItemsArray(array, maxItems);
            }
        };
        Game.prototype.setWinner = function (winner) {
            var state = this.game.state.getCurrentState();
            if (state) {
                state.setWinner(winner);
            }
        };
        Game.prototype.setTime = function (time) {
            var state = this.game.state.getCurrentState();
            if (state) {
                state.setTime(time);
            }
        };
        Game.prototype.setWaterLevel = function (percentage, delay) {
            var state = this.game.state.getCurrentState();
            if (state) {
                state.setWaterLevel(percentage, delay);
            }
        };
        Game.prototype.destroy = function () {
            this.game.destroy();
        };
        return Game;
    })();
    WaterSkillGame.Game = Game;
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Models;
    (function (Models) {
        var SkillModel = (function () {
            function SkillModel() {
            }
            return SkillModel;
        })();
        Models.SkillModel = SkillModel;
    })(Models = WaterSkillGame.Models || (WaterSkillGame.Models = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var Avatar = (function (_super) {
            __extends(Avatar, _super);
            function Avatar(game, x, y, water, totalPotValue, count) {
                _super.call(this, game, x, y);
                game.add.existing(this);
                this.valueOfItems = count || 1;
                this.totalPotValue = totalPotValue;
                var scale = this.calculateCurrentScale();
                this.scale.x = scale;
                this.scale.y = scale;
                this.game.physics.p2.enable(this);
                this.water = water;
                this.body.angularVelocity = (Math.random() * 8) - 4;
            }
            Avatar.prototype.autoScale = function (speed) {
                if (_.isUndefined(speed)) {
                    speed = 500;
                }
                var scale = this.calculateCurrentScale();
                this.game.add.tween(this.scale).to({ x: scale, y: scale }, speed, Phaser.Easing.Linear.None, true);
            };
            Avatar.prototype.update = function () {
                var velocity = [];
                this.body.getVelocityAtPoint(velocity, [0, 0]);
                var velocityVector = new Phaser.Point(velocity[0], velocity[1]);
                if (this.position.y > this.water.getWaterLevel(this.position.x).y) {
                    if (!this.splashed) {
                        this.water.splash(this.position.x, velocityVector.getMagnitude() * 3);
                        this.splashed = true;
                    }
                }
                this.body.angularVelocity *= 0.99;
            };
            Avatar.prototype.calculateCurrentScale = function () {
                return this.valueOfItems / this.totalPotValue;
            };
            return Avatar;
        })(Phaser.Sprite);
        Prefabs.Avatar = Avatar;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var AvatarSpriteLoader = (function (_super) {
            __extends(AvatarSpriteLoader, _super);
            function AvatarSpriteLoader(game, apiDomain) {
                this.avatarDictionary = {};
                this.apiDomain = apiDomain;
                _super.call(this, game);
            }
            AvatarSpriteLoader.prototype.loadAvatar = function (key, callback) {
                var _this = this;
                if (this.avatarDictionary[key] == true) {
                    callback(key);
                    return;
                }
                this.image(key, this.apiDomain + '/api/proxy/' + key + '/avatar', true);
                this.onLoadComplete.addOnce(function () {
                    _this.avatarDictionary[key] = true;
                    callback(key);
                });
                this.start();
            };
            return AvatarSpriteLoader;
        })(Phaser.Loader);
        Prefabs.AvatarSpriteLoader = AvatarSpriteLoader;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var BuoyancyManager = (function () {
            function BuoyancyManager(k, c) {
                this.liftForce = new Phaser.Point();
                this.k = 100; // up force per submerged "volume"
                this.c = 0.8; // viscosity
                this.v = [0, 0];
                this.k = k;
                this.c = c;
            }
            BuoyancyManager.prototype.applyAABBBuoyancyForces = function (body, planePosition) {
                var centerOfBuoyancy = new Phaser.Point();
                // Get shape AABB
                var bounds = body.sprite.getBounds();
                var areaUnderWater;
                if (bounds.y > planePosition.y) {
                    // Fully submerged
                    centerOfBuoyancy = body.sprite.position;
                    areaUnderWater = bounds.height * bounds.width;
                }
                else if (bounds.y + bounds.height > planePosition.y) {
                    // Partially submerged
                    var width = bounds.width;
                    var height = Math.abs(bounds.y - planePosition.y);
                    //areaUnderWater = width * height;
                    areaUnderWater = bounds.height * bounds.width;
                    centerOfBuoyancy = body.sprite.position;
                }
                else {
                    return;
                }
                // Compute lift force
                this.liftForce = Phaser.Point.subtract(centerOfBuoyancy, planePosition);
                this.liftForce.setMagnitude(areaUnderWater * this.k);
                // Make center of bouycancy relative to the body
                centerOfBuoyancy = Phaser.Point.subtract(centerOfBuoyancy, body.sprite.position);
                // Apply forces
                body.velocity.x = body.velocity.x * this.c;
                body.velocity.y = body.velocity.y * this.c;
                //body.applyForce([this.viscousForce.x, this.viscousForce.y], centerOfBuoyancy.x, centerOfBuoyancy.y);
                body.applyForce([0, this.liftForce.y], centerOfBuoyancy.x, centerOfBuoyancy.y);
            };
            return BuoyancyManager;
        })();
        Prefabs.BuoyancyManager = BuoyancyManager;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var JackpotEntries = (function () {
            function JackpotEntries(game, array, maxItems, water, avatarSpriteLoader, avatarGroup) {
                this.referenceArray = array;
                this.maxItems = maxItems;
                this.avatarDictionary = {};
                this.game = game;
                this.water = water;
                this.avatarSpriteLoader = avatarSpriteLoader;
                this.avatarGroup = avatarGroup;
            }
            JackpotEntries.prototype.update = function () {
                _.forEach(this.avatarDictionary, function (avatar) {
                    avatar.update();
                });
            };
            JackpotEntries.prototype.checkChanged = function () {
                if (this.currentArray == undefined || this.currentArray.length != this.referenceArray.length) {
                    this.currentArray = _.cloneDeep(this.referenceArray);
                    return true;
                }
                return false;
            };
            JackpotEntries.prototype.calculateLevel = function () {
                return this.referenceArray.length / this.maxItems;
            };
            JackpotEntries.prototype.calculateTotalPrice = function () {
                var sum = 0;
                this.referenceArray.forEach(function (entry) {
                    sum += entry.item.price.value;
                });
                return sum;
            };
            JackpotEntries.prototype.clear = function () {
                _.forEach(this.avatarDictionary, function (avatar) {
                    avatar.kill();
                });
                this.avatarDictionary = {};
            };
            JackpotEntries.prototype.createAvatarCountDictionary = function () {
                var dictionary = {};
                this.referenceArray.forEach(function (entry) {
                    var id = entry.user._id || entry.user;
                    if (dictionary[id]) {
                        dictionary[id] += entry.item.price.value;
                    }
                    else {
                        dictionary[id] = entry.item.price.value;
                    }
                });
                return dictionary;
            };
            JackpotEntries.prototype.calculateAvatars = function () {
                var _this = this;
                _.forEach(this.avatarDictionary, function (avatar) {
                    avatar.valueOfItems = 0;
                });
                var countDictionary = this.createAvatarCountDictionary();
                _.forEach(countDictionary, function (value, key) {
                    var avatar = _this.avatarDictionary[key];
                    if (avatar) {
                        avatar.valueOfItems = value;
                        avatar.totalPotValue = _this.calculateTotalPrice();
                    }
                    else {
                        _this.loadAvatar(key, value);
                    }
                });
                _.forEach(this.avatarDictionary, function (avatar) {
                    avatar.autoScale();
                });
            };
            JackpotEntries.prototype.forEachAvatar = function (lambda) {
                _.forEach(this.avatarDictionary, lambda);
            };
            JackpotEntries.prototype.getCount = function () {
                return this.referenceArray.length;
            };
            JackpotEntries.prototype.loadAvatar = function (key, value) {
                var avatar = new Prefabs.Avatar(this.game, Math.random() * (this.game.width - 150), 100, this.water, this.calculateTotalPrice(), value);
                this.avatarDictionary[key] = avatar;
                this.game.physics.enable([avatar], Phaser.Physics.ARCADE);
                avatar.body.collideWorldBounds = true;
                //this.avatarGroup.add(avatar);
                this.avatarSpriteLoader.loadAvatar(key, function () {
                    avatar.loadTexture(key);
                });
            };
            return JackpotEntries;
        })();
        Prefabs.JackpotEntries = JackpotEntries;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var WaterPoint = (function (_super) {
            __extends(WaterPoint, _super);
            function WaterPoint(game, x, y, targetHeight, k) {
                this.targetHeight = targetHeight;
                this.k = k;
                this.game = game;
                this.speed = 0;
                this.activeTween = game.add.tween(this).to({ y: y, targetHeight: targetHeight }, 10, Phaser.Easing.Linear.None, true);
                this.tweenQueue = new Array();
                _super.call(this, x, y);
            }
            WaterPoint.prototype.update = function (dampening, tension) {
                var deltaY = this.targetHeight - this.y;
                this.speed += tension * deltaY - this.speed * dampening;
                this.y += this.speed;
            };
            WaterPoint.prototype.setLevel = function (height, delay, callback) {
                var newTween = this.game.add.tween(this).to({ targetHeight: height }, delay, Phaser.Easing.Cubic.Out);
                newTween.start();
                if (callback) {
                    newTween.onComplete.add(callback);
                }
                /*newTween.onComplete.add(() => {
                    console.log("done");
                    var tween = this.tweenQueue.shift();
    
                    if (!_.isUndefined(tween)) {
                        tween.start();
                    }
                });
                
                this.tweenQueue.push(newTween);
    
                if (this.tweenQueue.length == 1) {
                    this.tweenQueue[0].start();
                }*/
            };
            return WaterPoint;
        })(Phaser.Point);
        var Water = (function (_super) {
            __extends(Water, _super);
            function Water(game, level) {
                this.game = game;
                this.k = 0.025;
                this.passThroughs = 1;
                this.spread = 0.25;
                this.resolution = 20;
                this.level = level;
                this.waterPoints = this.createwaterPoints(this.resolution, this.calculateWaterHeight(), this.k);
                _super.call(this, this.createWater(this.waterPoints));
                this.game.physics.p2.enable(this);
            }
            Water.prototype.update = function () {
                var _this = this;
                var graphicsCollection = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    graphicsCollection[_i - 0] = arguments[_i];
                }
                for (var i = 0; i < this.waterPoints.length - 2; i++) {
                    this.waterPoints[i].update(0.025, 0.025);
                }
                var leftDeltas = Array();
                var rightDeltas = Array();
                // do some passes where this.waterPoints pull on their neighbours
                for (var j = 0; j < this.passThroughs; j++) {
                    for (var i = 0; i < this.waterPoints.length - 3; i++) {
                        if (i > 0) {
                            leftDeltas[i] = this.spread * (this.waterPoints[i].y - this.waterPoints[i - 1].y);
                            this.waterPoints[i - 1].speed += leftDeltas[i];
                        }
                        if (i < this.waterPoints.length - 1) {
                            rightDeltas[i] = this.spread * (this.waterPoints[i].y - this.waterPoints[i + 1].y);
                            this.waterPoints[i + 1].speed += rightDeltas[i];
                        }
                    }
                    for (var i = 0; i < this.waterPoints.length - 3; i++) {
                        if (i > 0)
                            this.waterPoints[i - 1].y += leftDeltas[i];
                        if (i < this.waterPoints.length - 1)
                            this.waterPoints[i + 1].y += rightDeltas[i];
                    }
                }
                this.fixWaterPositions();
                graphicsCollection.forEach(function (graphics) {
                    graphics.beginFill(0x4da6ff);
                    _this.points = _this.waterPoints;
                    graphics.drawPolygon(_this.points);
                });
            };
            Water.prototype.fixWaterPositions = function () {
                var singleLength = this.game.width / this.resolution;
                for (var i = 0; i <= this.waterPoints.length - 3; i++) {
                    this.waterPoints[i].x = singleLength * i;
                }
                this.waterPoints[this.waterPoints.length - 2].x = this.game.width;
                this.waterPoints[this.waterPoints.length - 2].y = this.game.height;
                this.waterPoints[this.waterPoints.length - 1].y = this.game.height;
            };
            Water.prototype.createwaterPoints = function (resolution, waterHeight, k) {
                var points = Array();
                var singleLength = this.game.width / resolution;
                for (var i = 0; i <= resolution; i++) {
                    points.push(new WaterPoint(this.game, singleLength * i, waterHeight, waterHeight, k));
                }
                return points;
            };
            Water.prototype.createWater = function (waterPoints) {
                waterPoints.push(new Phaser.Point(this.game.width, this.game.height));
                waterPoints.push(new Phaser.Point(0, this.game.height));
                return waterPoints;
            };
            Water.prototype.calculateWaterHeight = function () {
                return this.game.height - (this.game.height * this.level);
            };
            Water.prototype.splash = function (position, speed) {
                var singleLength = this.game.width / this.resolution;
                var index = Math.round(position / singleLength);
                if (index >= 0 && index < this.waterPoints.length) {
                    this.waterPoints[index].speed = speed;
                }
            };
            Water.prototype.setLevel = function (percentage, delay, callback) {
                if (_.isUndefined(delay)) {
                    delay = Phaser.Timer.SECOND * 2;
                }
                if (!_.isUndefined(percentage)) {
                    this.level = percentage;
                }
                for (var i = 0; i < this.waterPoints.length - 2; i++) {
                    this.waterPoints[i].setLevel(this.calculateWaterHeight(), delay, callback);
                }
                ;
            };
            Water.prototype.resize = function () {
                this.setLevel(this.level);
            };
            Water.prototype.getWaterLevel = function (position) {
                var singleLength = this.game.width / this.resolution;
                var index = Math.round(position / singleLength);
                if (index >= this.waterPoints.length || index < 0) {
                    return new Phaser.Point(0, this.waterPoints[0].y);
                }
                return new Phaser.Point(0, this.waterPoints[index].y);
            };
            return Water;
        })(Phaser.Polygon);
        Prefabs.Water = Water;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var Winner = (function (_super) {
            __extends(Winner, _super);
            function Winner(game, x, y, key) {
                _super.call(this, game, game.width / 2, game.height, key);
                game.add.existing(this);
                this.anchor.x = 0.5;
                this.anchor.y = 1;
                this.z = -10;
            }
            Winner.prototype.update = function () {
                this.x = this.game.width / 2;
                this.y = this.game.height;
            };
            return Winner;
        })(Phaser.Sprite);
        Prefabs.Winner = Winner;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var PriceText = (function () {
            function PriceText(game, maskGraphics) {
                this.game = game;
                this.waterText = this.game.add.text(this.game.width / 2, this.game.height / 2, '', { font: 'Source Sans Pro', fill: '#3399ff', align: 'center' });
                this.waterText.anchor.x = 0.5;
                this.waterText.anchor.y = 0.5;
                this.waterText.setShadow(0, 3, '#005b99', 0);
                this.text = this.game.add.text(this.game.width / 2, this.game.height / 2, '', { font: 'Source Sans Pro', fill: '#ffffff', align: 'center' });
                this.text.anchor.x = 0.5;
                this.text.anchor.y = 0.5;
                this.waterSlotText = this.game.add.text(this.game.width / 2, this.game.height / 3, '', { font: 'Source Sans Pro', fill: '#3399ff', align: 'center' });
                this.waterSlotText.anchor.x = 0.5;
                this.waterSlotText.anchor.y = 0.5;
                this.waterSlotText.setShadow(0, 3, '#005b99', 0);
                this.slotText = this.game.add.text(this.game.width / 2, this.game.height / 3, '', { font: 'Source Sans Pro', fill: '#ffffff', align: 'center' });
                this.slotText.anchor.x = 0.5;
                this.slotText.anchor.y = 0.5;
                this.text.mask = maskGraphics;
                this.slotText.mask = maskGraphics;
            }
            PriceText.prototype.update = function () {
                this.text.x = this.game.width / 2;
                this.text.y = this.game.height / 2;
                this.waterText.x = this.game.width / 2;
                this.waterText.y = this.game.height / 2;
                this.slotText.x = this.game.width / 2;
                this.slotText.y = this.game.height / 3;
                this.waterSlotText.x = this.game.width / 2;
                this.waterSlotText.y = this.game.height / 3;
                this.text.fontSize = this.game.height / 4;
                this.waterText.fontSize = this.game.height / 4;
                this.slotText.fontSize = this.game.height / 12;
                this.waterSlotText.fontSize = this.game.height / 12;
            };
            PriceText.prototype.setPriceText = function (price) {
                this.text.setText('$' + price.toFixed(2));
                this.waterText.setText('$' + price.toFixed(2));
            };
            PriceText.prototype.setSlotText = function (currentTotal, maxTotal) {
                var text = currentTotal + '/' + maxTotal;
                this.slotText.setText(text);
                this.waterSlotText.setText(text);
            };
            return PriceText;
        })();
        Prefabs.PriceText = PriceText;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var TimerText = (function () {
            function TimerText(game, maskGraphics) {
                this.game = game;
                this.text = game.add.text(game.width / 2, game.height / 3 * 2, '3:03', { font: 'Source Sans Pro', fill: '#3399ff', align: 'center', fontSize: game.height / 20 });
                this.text.anchor.x = 0.5;
                this.text.anchor.y = 0.5;
                this.text.setShadow(0, 2, '#005b99', 0);
                this.maskedText = game.add.text(game.width / 2, game.height / 3 * 2, '3:03', { font: 'Source Sans Pro', fill: '#ffffff', align: 'center', fontSize: game.height / 20 });
                this.maskedText.anchor.x = 0.5;
                this.maskedText.anchor.y = 0.5;
                this.maskedText.mask = maskGraphics;
                this.timer = game.time.create(true);
            }
            TimerText.prototype.update = function () {
                this.updateText(this.text);
                this.updateText(this.maskedText);
            };
            TimerText.prototype.updateText = function (text) {
                text.y = this.game.height / 3 * 2;
                text.x = this.game.width / 2;
                text.fontSize = this.game.height / 20;
                if (this.timer.running && this.timer.ms > 0) {
                    text.text = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
                }
                else {
                    text.text = '';
                }
            };
            TimerText.prototype.setTime = function (time) {
                var _this = this;
                if (time === 0) {
                    return;
                }
                this.timer = this.game.time.create(true);
                this.timerEvent = this.timer.add(time, function () {
                    _this.timer.stop();
                    _this.timer = _this.game.time.create(true);
                }, this);
                this.timer.start();
            };
            TimerText.prototype.hardReset = function () {
                this.timer.stop();
                this.timer = this.game.time.create(true);
            };
            TimerText.prototype.formatTime = function (s) {
                var minuteRaw = Math.floor(s / 60);
                var minutes = "0" + minuteRaw;
                var seconds = "0" + (s - minuteRaw * 60);
                return minutes.substr(-2) + ":" + seconds.substr(-2);
            };
            return TimerText;
        })();
        Prefabs.TimerText = TimerText;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var WinnerText = (function (_super) {
            __extends(WinnerText, _super);
            function WinnerText(game, y) {
                var style = { font: 'Source Sans Pro', fill: '#3399ff', align: 'center', fontSize: game.width / 64 };
                _super.call(this, game, game.width / 2, y, '', style);
                game.add.existing(this);
                this.anchor.x = 0.5;
                this.anchor.y = 0;
                this.setShadow(0, 1, '#005b99', 0);
            }
            WinnerText.prototype.slideUp = function (y, delay) {
                var newTween = this.game.add.tween(this).to({ y: y }, 2000, Phaser.Easing.Cubic.Out);
                newTween.start();
            };
            WinnerText.prototype.update = function () {
                if (_.isEmpty(this.text)) {
                    this.y = this.game.height;
                }
                this.x = this.game.width / 2;
                this.fontSize = this.game.width / 64;
            };
            WinnerText.prototype.clear = function () {
                this.y = this.game.height;
                this.text = '';
            };
            return WinnerText;
        })(Phaser.Text);
        Prefabs.WinnerText = WinnerText;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var States;
    (function (States) {
        var MainState = (function (_super) {
            __extends(MainState, _super);
            function MainState() {
                _super.call(this);
            }
            MainState.prototype.preload = function () {
                this.game.stage.disableVisibilityChange = true;
            };
            MainState.prototype.create = function () {
                var _this = this;
                this.avatarGroup = this.game.add.group();
                this.waterGroup = this.game.add.group();
                this.winnerGroup = this.game.add.group();
                this.setUpPhysics();
                this.water = new WaterSkillGame.Prefabs.Water(this.game, 0);
                this.buoyancyManager = new WaterSkillGame.Prefabs.BuoyancyManager(0.09, 0.9);
                this.game.stage.backgroundColor = 0xFFFFFF;
                this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                this.game.tweens.frameBased = true;
                this.graphics = this.game.add.graphics(0, 0);
                this.waterMask = new Phaser.Graphics(this.game, 0, 0);
                this.priceText = new WaterSkillGame.Prefabs.PriceText(this.game, this.waterMask);
                this.avatarSpriteLoader = new WaterSkillGame.Prefabs.AvatarSpriteLoader(this.game, this.game.apiDomain);
                this.avatarSpriteLoader.crossOrigin = "anonymous";
                this.winnerFactory = new WaterSkillGame.Prefabs.WinnerFactory(this.game, this.avatarSpriteLoader, this.winnerGroup);
                this.game.stateLoadedCallback();
                this.game.scale.onSizeChange.add(function () {
                    _this.water.setLevel();
                });
                this.winnerText = new WaterSkillGame.Prefabs.WinnerText(this.game, this.game.height / 4 * 3);
                this.timerText = new WaterSkillGame.Prefabs.TimerText(this.game, this.waterMask);
                //this.waterGroup.add(this.priceText);
            };
            MainState.prototype.update = function () {
                var _this = this;
                if (this.jackpotEntries && this.jackpotEntries.checkChanged()) {
                    this.doChanged();
                }
                this.waterMask.clear();
                this.graphics.clear();
                this.water.update(this.graphics, this.waterMask);
                this.graphics.endFill();
                this.waterMask.endFill();
                this.jackpotEntries.forEachAvatar(function (avatar) {
                    _this.buoyancyManager.applyAABBBuoyancyForces(avatar.body, _this.water.getWaterLevel(avatar.position.x));
                });
                this.priceText.update();
                this.winnerText.update();
                this.timerText.update();
            };
            MainState.prototype.doChanged = function () {
                this.priceText.setPriceText(this.jackpotEntries.calculateTotalPrice());
                this.priceText.setSlotText(this.jackpotEntries.getCount(), this.maxItems);
                if (this.winner) {
                    this.winner.kill();
                    this.winnerText.clear();
                }
                if (this.jackpotEntries.getCount() == 0) {
                    this.jackpotEntries.clear();
                }
                else {
                    this.jackpotEntries.calculateAvatars();
                    this.water.setLevel(this.jackpotEntries.calculateLevel());
                }
            };
            MainState.prototype.setUpPhysics = function () {
                this.game.physics.startSystem(Phaser.Physics.P2JS);
                this.game.physics.p2.gravity.y = 1000;
                this.game.physics.p2.restitution = 0.3;
            };
            MainState.prototype.setWaterLevel = function (level, delay) {
                this.water.setLevel(level, delay);
            };
            MainState.prototype.setJackpotItemsArray = function (array, maxItems) {
                this.maxItems = maxItems;
                this.jackpotEntries = new WaterSkillGame.Prefabs.JackpotEntries(this.game, array, maxItems, this.water, this.avatarSpriteLoader, this.avatarGroup);
                this.jackpotEntries.calculateAvatars();
                this.water.setLevel(this.jackpotEntries.calculateLevel());
            };
            MainState.prototype.setWinner = function (winnerJson) {
                var _this = this;
                //this.water.setLevel(1, Phaser.Timer.SECOND * 1);
                this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
                    _this.water.splash(_this.game.width / 2, 150);
                    _this.winnerText.slideUp(_this.game.height / 3 * 2, Phaser.Timer.SECOND * 2);
                });
                setTimeout(function () {
                    _this.winnerFactory.newInstance(winnerJson.user._id, function (winner) {
                        _this.winner = winner;
                        _this.winnerText.text = winnerJson.user.name + ' won with ' + (winnerJson.chance * 100).toFixed(2) + '% chance';
                    });
                }, Phaser.Timer.SECOND * 2);
                this.timerText.hardReset();
            };
            MainState.prototype.setTime = function (time) {
                this.timerText.setTime(time);
            };
            return MainState;
        })(Phaser.State);
        States.MainState = MainState;
    })(States = WaterSkillGame.States || (WaterSkillGame.States = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
