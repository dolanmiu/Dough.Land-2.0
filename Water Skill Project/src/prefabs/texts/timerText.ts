namespace WaterSkillGame.Prefabs {
    export class TimerText {

        private game: Phaser.Game;

        private timer: Phaser.Timer;
        private timerEvent: Phaser.TimerEvent;

        private text: Phaser.Text;
        private maskedText: Phaser.Text;

        constructor(game: Phaser.Game, maskGraphics: Phaser.Graphics) {
            this.game = game;

            this.text = game.add.text(game.width / 2, game.height / 3 * 2, "3:03", { font: "Source Sans Pro", fill: "#3399ff", align: "center", fontSize: game.height / 20 });
            this.text.anchor.x = 0.5;
            this.text.anchor.y = 0.5;
            this.text.setShadow(0, 2, "#005b99", 0);

            this.maskedText = game.add.text(game.width / 2, game.height / 3 * 2, "3:03", { font: "Source Sans Pro", fill: "#ffffff", align: "center", fontSize: game.height / 20 });
            this.maskedText.anchor.x = 0.5;
            this.maskedText.anchor.y = 0.5;

            this.maskedText.mask = maskGraphics;

            this.timer = game.time.create(true);
        }

        update() {
            this.updateText(this.text);
            this.updateText(this.maskedText);
        }

        private updateText(text: Phaser.Text) {
            text.y = this.game.height / 3 * 2;
            text.x = this.game.width / 2;
            text.fontSize = this.game.height / 20;


            if (this.timer.running && this.timer.ms > 0) {
                text.text = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
            } else {
                text.text = "";
            }
        }

        setTime(time) {
            if (time === 0) {
                return;
            }
            this.timer = this.game.time.create(true);
            this.timerEvent = this.timer.add(time, () => {
                this.timer.stop();
                this.timer = this.game.time.create(true);
            }, this);
            this.timer.start();
        }

        hardReset() {
            this.timer.stop();
            this.timer = this.game.time.create(true);
        }

        private formatTime(s) {
            var minuteRaw = Math.floor(s / 60)
            var minutes = "0" + minuteRaw;
            var seconds = "0" + (s - minuteRaw * 60);
            return minutes.substr(-2) + ":" + seconds.substr(-2);
        }

    }
}