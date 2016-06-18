namespace WaterSkillGame.Prefabs {
    export class SkillPillFactory {

        private game: Phaser.Game;
        private imageLoader: ProxyImageLoader;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.imageLoader = new ProxyImageLoader(game);
        }

        newInstance(x: number, y: number, term: string, size: number): SkillPill {
            let buoyancyManager = new Prefabs.BuoyancyManager(0.04, 0.9);
            let skillPill = new SkillPill(this.game, x, y, buoyancyManager);
            this.imageLoader.load(term, (key) => {
                skillPill.loadTexture(key);
                skillPill.scale.setTo(size / skillPill.width);
                skillPill.body.setRectangleFromSprite(skillPill);
            });
            return skillPill;
        }
    }
}