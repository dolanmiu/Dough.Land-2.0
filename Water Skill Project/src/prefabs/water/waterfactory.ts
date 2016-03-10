module WaterSkillGame.Prefabs {
    export class WaterFactory {

        private game: Phaser.Game;
        private k: number;
        private resolution: number;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.k = 0.025;
            this.resolution = 20;
        }

        newInstance(level: number): Water {
            var waterHeight = this.game.height - (this.game.height * level);
            var waterPoints = this.createwaterPoints(this.resolution, waterHeight, this.k);
            var points = this.createWater(waterPoints);
            return new Water(this.game, level, this.resolution, points, waterPoints);
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
    }
}