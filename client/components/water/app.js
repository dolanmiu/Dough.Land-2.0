var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WaterSkillGame;
(function (WaterSkillGame) {
    var Game = (function () {
        function Game(width, height) {
            this.width = width;
            this.height = height;
        }
        Game.prototype.run = function (container, loadedCallback) {
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, container, WaterSkillGame.States.MainState);
            this.game.stateLoadedCallback = loadedCallback;
        };
        Game.prototype.setItemsArray = function (array) {
            var state = this.game.state.getCurrentState();
            if (state) {
                state.setItemsArray(array);
            }
        };
        Game.prototype.setWaterLevel = function (percentage, delay) {
            var state = this.game.state.getCurrentState();
            if (state) {
                state.setWaterLevel(percentage, delay);
            }
        };
        return Game;
    }());
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
        }());
        Models.SkillModel = SkillModel;
    })(Models = WaterSkillGame.Models || (WaterSkillGame.Models = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var MouseDragHandler = (function (_super) {
            __extends(MouseDragHandler, _super);
            function MouseDragHandler(game) {
                _super.call(this);
                this.game = game;
                this.sprites = [];
                game.physics.p2.world.addBody(this);
                game.input.onDown.add(this.click, this);
                game.input.onUp.add(this.release, this);
                game.input.addMoveCallback(this.move, this);
            }
            MouseDragHandler.prototype.click = function (pointer) {
                var bodies = this.game.physics.p2.hitTest(pointer.position, this.sprites);
                // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
                var physicsPos = [this.game.physics.p2.pxmi(pointer.position.x), this.game.physics.p2.pxmi(pointer.position.y)];
                if (bodies.length) {
                    var clickedBody = bodies[0];
                    var localPointInBody = [0, 0];
                    // this function takes physicsPos and coverts it to the body's local coordinate system
                    clickedBody.toLocalFrame(localPointInBody, physicsPos);
                    // use a revoluteContraint to attach mouseBody to the clicked body
                    this.mouseConstraint = this.game.physics.p2.createRevoluteConstraint(this, [0, 0], clickedBody, [this.game.physics.p2.mpxi(localPointInBody[0]), this.game.physics.p2.mpxi(localPointInBody[1])]);
                }
            };
            MouseDragHandler.prototype.release = function () {
                // remove constraint from object's body
                this.game.physics.p2.removeConstraint(this.mouseConstraint);
            };
            MouseDragHandler.prototype.move = function (pointer) {
                // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
                this.position[0] = this.game.physics.p2.pxmi(pointer.position.x);
                this.position[1] = this.game.physics.p2.pxmi(pointer.position.y);
            };
            return MouseDragHandler;
        }(p2.Body));
        Prefabs.MouseDragHandler = MouseDragHandler;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var ProxyImageLoader = (function (_super) {
            __extends(ProxyImageLoader, _super);
            function ProxyImageLoader(game) {
                _super.call(this, game);
            }
            ProxyImageLoader.prototype.normaliseKey = function (key) {
                return key.replace("#", "sharp");
            };
            ProxyImageLoader.prototype.load = function (key, callback) {
                this.image(key, "/api/proxy/images/" + this.normaliseKey(key), false);
                this.onLoadComplete.addOnce(function () {
                    callback(key);
                });
                this.start();
            };
            return ProxyImageLoader;
        }(Phaser.Loader));
        Prefabs.ProxyImageLoader = ProxyImageLoader;
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
                    areaUnderWater = body.sprite.width * body.sprite.height;
                }
                else if (bounds.y + bounds.height > planePosition.y) {
                    // Partially submerged
                    var width = bounds.width;
                    var height = Math.abs(bounds.y - planePosition.y);
                    // areaUnderWater = width * height;
                    areaUnderWater = body.sprite.width * body.sprite.height;
                    centerOfBuoyancy = body.sprite.position;
                }
                else {
                    body.angularDamping = 0.1;
                    return;
                }
                // Compute lift force
                this.liftForce = Phaser.Point.subtract(centerOfBuoyancy, planePosition);
                // this.liftForce.setMagnitude(areaUnderWater * this.k);
                // Make center of bouycancy relative to the body
                centerOfBuoyancy = Phaser.Point.subtract(centerOfBuoyancy, body.sprite.position);
                // Apply forces
                body.velocity.x = body.velocity.x * this.c;
                body.velocity.y = body.velocity.y * this.c;
                body.angularDamping = 0.9;
                // body.applyForce([this.viscousForce.x, this.viscousForce.y], centerOfBuoyancy.x, centerOfBuoyancy.y);
                if (this.liftForce.y > 0) {
                    body.applyForce([0, this.liftForce.y], centerOfBuoyancy.x, centerOfBuoyancy.y);
                }
            };
            return BuoyancyManager;
        }());
        Prefabs.BuoyancyManager = BuoyancyManager;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var SkillPill = (function (_super) {
            __extends(SkillPill, _super);
            function SkillPill(game, x, y, buoyancyManager) {
                _super.call(this, game, x, y);
                this.inWater = false;
                this.buoyancyManager = buoyancyManager;
                this.game.physics.p2.enable(this);
                // this.water = water;
                this.body.angularVelocity = (Math.random() * 8) - 4;
                // this.body.debug = true;
                /*var text = this.game.add.text(0, 0, "MyText", { font: '14px Raleway', align: 'center' });
                text.anchor.setTo(0.5);
                text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
                //var textSprite = this.add.sprite(this.world.centerX - 100, this.world.centerY - 200, null);
                this.addChild(text);
                //this.physics.enable(textSprite, Phaser.Physics.ARCADE);
                /*textSprite.body.bounce.y = 1;
                textSprite.body.gravity.y = 2000;
                textSprite.body.collideWorldBounds = true;*/
            }
            SkillPill.prototype.updatePhysics = function (point, water) {
                if (point) {
                    this.buoyancyManager.applyAABBBuoyancyForces(this.body, point);
                }
                if (this.y > this.game.height / 2 && !this.inWater) {
                    water.splash(this.x, this.body.velocity.y / 10);
                }
                if (this.y < this.game.height / 2 && this.inWater) {
                    water.splash(this.x, this.body.velocity.y / 10);
                }
                if (this.y > this.game.height / 2) {
                    this.inWater = true;
                }
                else {
                    this.inWater = false;
                }
                /*var velocity = [];
                this.body.getVelocityAtPoint(velocity, [0, 0]);
                var velocityVector = new Phaser.Point(velocity[0], velocity[1]);
                if (this.position.y > this.water.getWaterLevel(this.position.x).y) {
                    if (!this.splashed) {
                        this.water.splash(this.position.x, velocityVector.getMagnitude() * 3);
                        this.splashed = true;
                    }
                }
                this.body.angularVelocity *= 0.99;*/
            };
            return SkillPill;
        }(Phaser.Sprite));
        Prefabs.SkillPill = SkillPill;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var SkillPillFactory = (function () {
            function SkillPillFactory(game) {
                this.game = game;
                this.imageLoader = new Prefabs.ProxyImageLoader(game);
            }
            SkillPillFactory.prototype.newInstance = function (x, y, term, size) {
                var buoyancyManager = new Prefabs.BuoyancyManager(0.04, 0.9);
                var skillPill = new Prefabs.SkillPill(this.game, x, y, buoyancyManager);
                this.imageLoader.load(term, function (key) {
                    skillPill.loadTexture(key);
                    skillPill.scale.setTo(size / skillPill.width);
                    skillPill.body.setRectangleFromSprite(skillPill);
                });
                return skillPill;
            };
            return SkillPillFactory;
        }());
        Prefabs.SkillPillFactory = SkillPillFactory;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var PriceText = (function () {
            function PriceText(game, maskGraphics) {
                this.game = game;
                this.waterText = this.game.add.text(this.game.width / 2, this.game.height / 2, "", { font: "Source Sans Pro", fill: "#3399ff", align: "center" });
                this.waterText.anchor.x = 0.5;
                this.waterText.anchor.y = 0.5;
                this.waterText.setShadow(0, 3, "#005b99", 0);
                this.text = this.game.add.text(this.game.width / 2, this.game.height / 2, "", { font: "Source Sans Pro", fill: "#ffffff", align: "center" });
                this.text.anchor.x = 0.5;
                this.text.anchor.y = 0.5;
                this.waterSlotText = this.game.add.text(this.game.width / 2, this.game.height / 3, "", { font: "Source Sans Pro", fill: "#3399ff", align: "center" });
                this.waterSlotText.anchor.x = 0.5;
                this.waterSlotText.anchor.y = 0.5;
                this.waterSlotText.setShadow(0, 3, "#005b99", 0);
                this.slotText = this.game.add.text(this.game.width / 2, this.game.height / 3, "", { font: "Source Sans Pro", fill: "#ffffff", align: "center" });
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
                this.text.setText("$" + price.toFixed(2));
                this.waterText.setText("$" + price.toFixed(2));
            };
            PriceText.prototype.setSlotText = function (currentTotal, maxTotal) {
                var text = currentTotal + "/" + maxTotal;
                this.slotText.setText(text);
                this.waterSlotText.setText(text);
            };
            return PriceText;
        }());
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
                this.text = game.add.text(game.width / 2, game.height / 3 * 2, "3:03", { font: "Source Sans Pro", fill: "#3399ff", align: "center", fontSize: game.height / 20 });
                this.text.anchor.x = 0.5;
                this.text.anchor.y = 0.5;
                this.text.setShadow(0, 2, "#005b99", 0);
                this.maskedText = game.add.text(game.width / 2, game.height / 3 * 2, "3:03", { font: "Source Sans Pro", fill: "#ffffff", align: "center", fontSize: game.height / 20 });
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
                    text.text = "";
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
        }());
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
                var style = { font: "Source Sans Pro", fill: "#3399ff", align: "center", fontSize: game.width / 64 };
                _super.call(this, game, game.width / 2, y, "", style);
                game.add.existing(this);
                this.anchor.x = 0.5;
                this.anchor.y = 0;
                this.setShadow(0, 1, "#005b99", 0);
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
                this.text = "";
            };
            return WinnerText;
        }(Phaser.Text));
        Prefabs.WinnerText = WinnerText;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var Water = (function (_super) {
            __extends(Water, _super);
            function Water(game, level, resolution, points, waterPoints) {
                _super.call(this, points);
                this.game = game;
                this.passThroughs = 1;
                this.spread = 0.25;
                this.resolution = resolution;
                this.level = level;
                this.waterPoints = waterPoints;
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
                    graphics.beginFill(0x4da6ff, 0.5);
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
        }(Phaser.Polygon));
        Prefabs.Water = Water;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var WaterPoint = (function (_super) {
            __extends(WaterPoint, _super);
            function WaterPoint(game, x, y, targetHeight, k) {
                _super.call(this, x, y);
                this.targetHeight = targetHeight;
                this.k = k;
                this.game = game;
                this.speed = 0;
                this.activeTween = game.add.tween(this).to({ y: y, targetHeight: targetHeight }, 10, Phaser.Easing.Linear.None, true);
                this.tweenQueue = new Array();
            }
            WaterPoint.prototype.update = function (dampening, tension) {
                var deltaY = this.targetHeight - this.y;
                this.speed += tension * deltaY - this.speed * dampening;
                this.y += this.speed;
            };
            return WaterPoint;
        }(Phaser.Point));
        Prefabs.WaterPoint = WaterPoint;
    })(Prefabs = WaterSkillGame.Prefabs || (WaterSkillGame.Prefabs = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
var WaterSkillGame;
(function (WaterSkillGame) {
    var Prefabs;
    (function (Prefabs) {
        var WaterFactory = (function () {
            function WaterFactory(game) {
                this.game = game;
                this.k = 0.025;
                this.resolution = 20;
            }
            WaterFactory.prototype.newInstance = function (level) {
                var waterHeight = this.game.height - (this.game.height * level);
                var waterPoints = this.createwaterPoints(this.resolution, waterHeight, this.k);
                var points = this.createWater(waterPoints);
                return new Prefabs.Water(this.game, level, this.resolution, points, waterPoints);
            };
            WaterFactory.prototype.createwaterPoints = function (resolution, waterHeight, k) {
                var points = Array();
                var singleLength = this.game.width / resolution;
                for (var i = 0; i <= resolution; i++) {
                    points.push(new Prefabs.WaterPoint(this.game, singleLength * i, waterHeight, waterHeight, k));
                }
                return points;
            };
            WaterFactory.prototype.createWater = function (waterPoints) {
                waterPoints.push(new Phaser.Point(this.game.width, this.game.height));
                waterPoints.push(new Phaser.Point(0, this.game.height));
                return waterPoints;
            };
            return WaterFactory;
        }());
        Prefabs.WaterFactory = WaterFactory;
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
                this.skillPills = new Array();
            }
            MainState.prototype.create = function () {
                var _this = this;
                this.skillPillGroup = new Phaser.Group(this.game);
                this.waterGroup = new Phaser.Group(this.game);
                this.waterGroup.z = 10;
                this.skillPillGroup.z = 1;
                this.setUpPhysics();
                var waterFactory = new WaterSkillGame.Prefabs.WaterFactory(this.game);
                this.water = waterFactory.newInstance(0.5);
                // this.waterGroup.add(this.water);
                this.game.stage.backgroundColor = 0xF5F5F5;
                this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                this.game.tweens.frameBased = true;
                this.graphics = this.game.add.graphics(0, 0);
                this.skillPillFactory = new WaterSkillGame.Prefabs.SkillPillFactory(this.game);
                this.game.scale.onSizeChange.add(function () {
                    _this.water.setLevel();
                });
                this.mouseDragHandler = new WaterSkillGame.Prefabs.MouseDragHandler(this.game);
                this.game.stateLoadedCallback();
            };
            MainState.prototype.update = function () {
                var _this = this;
                this.graphics.clear();
                this.water.update(this.graphics);
                this.graphics.endFill();
                this.skillPills.forEach(function (skillPill) {
                    skillPill.updatePhysics(_this.water.getWaterLevel(skillPill.position.x), _this.water);
                });
            };
            MainState.prototype.setUpPhysics = function () {
                this.game.physics.startSystem(Phaser.Physics.P2JS);
                this.game.physics.p2.gravity.y = 1000;
                this.game.physics.p2.restitution = 0.3;
            };
            MainState.prototype.setWaterLevel = function (level, delay) {
                this.water.setLevel(level, delay);
            };
            MainState.prototype.setItemsArray = function (array) {
                var _this = this;
                array.forEach(function (skillModel) {
                    var skillPill = _this.skillPillFactory.newInstance(100, 100, skillModel.skill.name, 100);
                    _this.game.add.existing(skillPill);
                    _this.mouseDragHandler.sprites.push(skillPill);
                    _this.skillPills.push(skillPill);
                    _this.skillPillGroup.add(skillPill);
                });
            };
            return MainState;
        }(Phaser.State));
        States.MainState = MainState;
    })(States = WaterSkillGame.States || (WaterSkillGame.States = {}));
})(WaterSkillGame || (WaterSkillGame = {}));
