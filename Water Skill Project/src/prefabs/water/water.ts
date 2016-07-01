namespace WaterSkillGame.Prefabs {
    export class Water extends Phaser.Polygon {

        private game: Phaser.Game;
        private waterPoints: WaterPoint[];
        private passThroughs: number;
        private spread: number;
        private resolution: number;
        private level: number;

        constructor(game: Phaser.Game, level: number, resolution: number, points: Phaser.Point[], waterPoints: WaterPoint[]) {
            super(points);
            this.game = game;
            this.passThroughs = 1;
            this.spread = 0.25;
            this.resolution = resolution;
            this.level = level;
            this.waterPoints = waterPoints;

            this.game.physics.p2.enable(this);
        }

        update(...graphicsCollection: Phaser.Graphics[]) {
            for (let i = 0; i < this.waterPoints.length - 2; i++) {
                this.waterPoints[i].update(0.025, 0.025);
            }

            let leftDeltas = Array<number>();
            let rightDeltas = Array<number>();

            // do some passes where this.waterPoints pull on their neighbours
            for (let j = 0; j < this.passThroughs; j++) {
                for (let i = 0; i < this.waterPoints.length - 3; i++) {
                    if (i > 0) {
                        leftDeltas[i] = this.spread * (this.waterPoints[i].y - this.waterPoints[i - 1].y);
                        this.waterPoints[i - 1].speed += leftDeltas[i];
                    }
                    if (i < this.waterPoints.length - 1) {
                        rightDeltas[i] = this.spread * (this.waterPoints[i].y - this.waterPoints[i + 1].y);
                        this.waterPoints[i + 1].speed += rightDeltas[i];
                    }
                }

                for (let i = 0; i < this.waterPoints.length - 3; i++) {
                    if (i > 0)
                        this.waterPoints[i - 1].y += leftDeltas[i];
                    if (i < this.waterPoints.length - 1)
                        this.waterPoints[i + 1].y += rightDeltas[i];
                }
            }

            this.fixWaterPositions();

            graphicsCollection.forEach(graphics => {
                graphics.beginFill(0x4da6ff, 0.5);
                this.points = this.waterPoints;
                graphics.drawPolygon(this.points);
            });
        }

        private fixWaterPositions() {
            let singleLength = this.game.width / this.resolution;
            for (let i = 0; i <= this.waterPoints.length - 3; i++) {
                this.waterPoints[i].x = singleLength * i;
            }

            this.waterPoints[this.waterPoints.length - 2].x = this.game.width;
            this.waterPoints[this.waterPoints.length - 2].y = this.game.height;

            this.waterPoints[this.waterPoints.length - 1].y = this.game.height;
        }



        private calculateWaterHeight(): number {
            return this.game.height - (this.game.height * this.level);
        }

        public splash(position: number, speed: number) {
            let singleLength = this.game.width / this.resolution;
            let index = Math.round(position / singleLength);
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

            for (let i = 0; i < this.waterPoints.length - 2; i++) {
                this.waterPoints[i].setLevel(this.calculateWaterHeight(), delay, callback);
            };
        }

        public resize() {
            this.setLevel(this.level);
        }

        public getWaterLevel(position: number): Phaser.Point {
            let singleLength = this.game.width / this.resolution;
            let index = Math.round(position / singleLength);
            if (index >= this.waterPoints.length || index < 0) {
                return new Phaser.Point(0, this.waterPoints[0].y);
            }
            return new Phaser.Point(0, this.waterPoints[index].y);
        }
    }
}