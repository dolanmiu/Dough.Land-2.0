namespace WaterSkillGame.Prefabs {
     export class WaterPoint extends Phaser.Point {

        private k: number;
        private activeTween: Phaser.Tween;
        private game: Phaser.Game;
        private tweenQueue: Array<Phaser.Tween>;

        public targetHeight: number;
        public speed: number;

        constructor(game: Phaser.Game, x: number, y: number, targetHeight: number, k: number) {
            super(x, y);
            this.targetHeight = targetHeight;
            this.k = k;
            this.game = game;
            this.speed = 0;
            this.activeTween = game.add.tween(this).to({ y: y, targetHeight: targetHeight }, 10, Phaser.Easing.Linear.None, true);
            this.tweenQueue = new Array<Phaser.Tween>();
        }

        update(dampening: number, tension: number) {
            let deltaY = this.targetHeight - this.y;
            this.speed += tension * deltaY - this.speed * dampening;
            this.y += this.speed;
        }

        setLevel(height, delay, callback?: () => void) {
            let newTween = this.game.add.tween(this).to({ targetHeight: height }, delay, Phaser.Easing.Cubic.Out);
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
}