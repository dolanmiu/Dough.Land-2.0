module WaterSkillGame.Prefabs {

    class WaterPoint extends Phaser.Point {

        private k: number;
        private activeTween: Phaser.Tween;
        private game: Phaser.Game;
        private tweenQueue: Array<Phaser.Tween>;

        public targetHeight: number;
        public speed: number;

        constructor(game: Phaser.Game, x: number, y: number, targetHeight: number, k: number) {
            this.targetHeight = targetHeight;
            this.k = k;
            this.game = game;
            this.speed = 0;
            this.activeTween = game.add.tween(this).to({ y: y, targetHeight: targetHeight }, 10, Phaser.Easing.Linear.None, true);
            this.tweenQueue = new Array<Phaser.Tween>();
            super(x, y);
        }

        update(dampening: number, tension: number) {
            var deltaY = this.targetHeight - this.y;
            this.speed += tension * deltaY - this.speed * dampening;
            this.y += this.speed;
        }

        setLevel(height, delay, callback?: () => void) {
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
        }
    }

    export class Water extends Phaser.Polygon {

        private game: Phaser.Game;
        private k: number;
        private waterPoints: WaterPoint[];
        private passThroughs: number;
        private spread: number;
        private resolution: number;
        private level: number;

        constructor(game: Phaser.Game, level: number) {
            this.game = game;
            this.k = 0.025;
            this.passThroughs = 1;
            this.spread = 0.25;
            this.resolution = 20;
            this.level = level;

            this.waterPoints = this.createwaterPoints(this.resolution, this.calculateWaterHeight(), this.k);
            super(this.createWater(this.waterPoints));
            this.game.physics.p2.enable(this);
        }

        update(...graphicsCollection: Phaser.Graphics[]) {
            for (var i = 0; i < this.waterPoints.length - 2; i++) {
                this.waterPoints[i].update(0.025, 0.025);
            }

            var leftDeltas = Array<number>();
            var rightDeltas = Array<number>();
             
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

            graphicsCollection.forEach(graphics => {
                graphics.beginFill(0x4da6ff);
                this.points = this.waterPoints;
                graphics.drawPolygon(this.points);
            });
        }

        private fixWaterPositions() {
            var singleLength = this.game.width / this.resolution;
            for (var i = 0; i <= this.waterPoints.length - 3; i++) {
                this.waterPoints[i].x = singleLength * i;
            }

            this.waterPoints[this.waterPoints.length - 2].x = this.game.width;
            this.waterPoints[this.waterPoints.length - 2].y = this.game.height;

            this.waterPoints[this.waterPoints.length - 1].y = this.game.height;
        }

        private createwaterPoints(resolution: number, waterHeight: number, k: number): WaterPoint[] {
            var points = Array<WaterPoint>();
            var singleLength = this.game.width / resolution;

            for (var i = 0; i <= resolution; i++) {
                points.push(new WaterPoint(this.game, singleLength * i, waterHeight, waterHeight, k));
            }
            return points;
        }

        private createWater(waterPoints: Phaser.Point[]): Phaser.Point[] {
            waterPoints.push(new Phaser.Point(this.game.width, this.game.height));
            waterPoints.push(new Phaser.Point(0, this.game.height));
            return waterPoints;
        }

        private calculateWaterHeight(): number {
            return this.game.height - (this.game.height * this.level);
        }

        public splash(position: number, speed: number) {
            var singleLength = this.game.width / this.resolution;
            var index = Math.round(position / singleLength);
            if (index >= 0 && index < this.waterPoints.length) {
                this.waterPoints[index].speed = speed;
            }
        }

        public setLevel(percentage?: number, delay?: number, callback?: () => void) {
            if (_.isUndefined(delay)) {
                delay = Phaser.Timer.SECOND * 2;
            }
            if (!_.isUndefined(percentage)) {
                this.level = percentage;
            }

            for (var i = 0; i < this.waterPoints.length - 2; i++) {
                this.waterPoints[i].setLevel(this.calculateWaterHeight(), delay, callback);
            };
        }

        public resize() {
            this.setLevel(this.level);
        }

        public getWaterLevel(position: number): Phaser.Point {
            var singleLength = this.game.width / this.resolution;
            var index = Math.round(position / singleLength);
            if (index >= this.waterPoints.length || index < 0) {
                return new Phaser.Point(0, this.waterPoints[0].y);
            }
            return new Phaser.Point(0, this.waterPoints[index].y);
        }
    }
}