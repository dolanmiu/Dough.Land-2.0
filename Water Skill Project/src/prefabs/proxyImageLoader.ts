module WaterSkillGame.Prefabs {
    export class ProxyImageLoader extends Phaser.Loader {

        constructor(game: Phaser.Game) {
            super(game);
        }

        load(key: string, callback: (key: string) => void) {          
            this.image(key, '/api/proxy/images' + key, false);
            this.onLoadComplete.addOnce(() => {
                callback(key);
            });
            this.start();
        }
    }
}
