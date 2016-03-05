module WaterSkillGame.Prefabs {
    export class Avatar extends Phaser.Sprite {

        public valueOfItems: number;
        public totalPotValue: number;
        private water: Water;
        private splashed: boolean;

        constructor(game: Phaser.Game, x: number, y: number, water: Water, totalPotValue: number, count?: number) {
            super(game, x, y);
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

        autoScale(speed?: number) {
            if (_.isUndefined(speed)) {
                speed = 500;
            }
            var scale = this.calculateCurrentScale();
            this.game.add.tween(this.scale).to({ x: scale, y: scale }, speed, Phaser.Easing.Linear.None, true);
        }

        update() {
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
        }

        private calculateCurrentScale(): number {
            return this.valueOfItems / this.totalPotValue;
        }
    }
}
