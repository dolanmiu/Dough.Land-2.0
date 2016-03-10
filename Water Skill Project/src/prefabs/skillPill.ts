module WaterSkillGame.Prefabs {
    export class SkillPill extends Phaser.Sprite {

        private water: Water;
        private splashed: boolean;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y);
            
            this.game.physics.p2.enable(this);
            //this.water = water;
            this.body.angularVelocity = (Math.random() * 8) - 4;

            var text = this.game.add.text(0, 0, "MyText", { font: '14px Raleway', align: 'center' }); 
            text.anchor.setTo(0.5); 
            text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5); 
            //var textSprite = this.add.sprite(this.world.centerX - 100, this.world.centerY - 200, null); 
            this.addChild(text); 
            //this.physics.enable(textSprite, Phaser.Physics.ARCADE); 
            /*textSprite.body.bounce.y = 1; 
            textSprite.body.gravity.y = 2000; 
            textSprite.body.collideWorldBounds = true;*/
        }

        update() {
            /*var velocity = [];
            this.body.getVelocityAtPoint(velocity, [0, 0]);
            var velocityVector = new Phaser.Point(velocity[0], velocity[1]);
            if (this.position.y > this.water.getWaterLevel(this.position.x).y) {
                if (!this.splashed) {
                    this.water.splash(this.position.x, velocityVector.getMagnitude() * 3);
                    this.splashed = true;
                }
            }
            this.body.angularVelocity *= 0.99;*/
        }
    }
}
