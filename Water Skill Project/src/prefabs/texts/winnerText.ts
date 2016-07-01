namespace WaterSkillGame.Prefabs {
    export class WinnerText extends Phaser.Text {

        constructor(game: Phaser.Game, y: number) {
            var style = <Phaser.PhaserTextStyle>{ font: "Source Sans Pro", fill: "#3399ff", align: "center", fontSize: game.width / 64 };
            super(game, game.width / 2, y, "", style);
            game.add.existing(this);
            this.anchor.x = 0.5;
            this.anchor.y = 0;
            this.setShadow(0, 1, "#005b99", 0);
        }

        slideUp(y: number, delay: number) {
            var newTween = this.game.add.tween(this).to({ y: y }, 2000, Phaser.Easing.Cubic.Out);
            newTween.start();
        }

        update() {
            if (_.isEmpty(this.text)) {
                this.y = this.game.height;
            }
            this.x = this.game.width / 2;
            this.fontSize = this.game.width / 64;
        }

        clear() {
            this.y = this.game.height;
            this.text = "";
        }
    }
}