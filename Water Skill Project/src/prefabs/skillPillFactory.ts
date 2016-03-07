module WaterSkillGame.Prefabs {
    export class SkillPillFactory {

        private game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        newInstance(x: number, y: number): SkillPill {
            return new SkillPill(this.game, x, y);
        }
    }
}