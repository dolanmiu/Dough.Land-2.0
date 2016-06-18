namespace WaterSkillGame.Prefabs {
    export class ProxyImageLoader extends Phaser.Loader {

        constructor(game: Phaser.Game) {
            super(game);
        }

        private normaliseKey(key: string) {
            return key.replace("#", "sharp");
        }

        load(key: string, callback: (key: string) => void) {
            this.image(key, "/api/proxy/images/" + this.normaliseKey(key), false);
            this.onLoadComplete.addOnce(() => {
                callback(key);
            });
            this.start();
        }
    }
}
