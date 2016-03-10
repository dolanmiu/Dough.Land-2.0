module WaterSkillGame.Prefabs {
    export class SkillPillFactory {

        private game: Phaser.Game;
        private imageLoader: ProxyImageLoader;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.imageLoader = new ProxyImageLoader(game);
        }

        newInstance(x: number, y: number, term: string): SkillPill {
            var skillPill = new SkillPill(this.game, x, y);
            this.imageLoader.load(term, (key) => {
                skillPill.loadTexture(key);
            });
            return skillPill;
        }
    }
}