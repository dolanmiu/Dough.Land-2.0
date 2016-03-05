module WaterSkillGame.Prefabs {
	export class PriceText {

		private game: Phaser.Game;
		private text: Phaser.Text;
		private waterText: Phaser.Text;
		private slotText: Phaser.Text;
		private waterSlotText: Phaser.Text;

		constructor(game: Phaser.Game, maskGraphics: Phaser.Graphics) {
			this.game = game;

			this.waterText = this.game.add.text(this.game.width / 2, this.game.height / 2, '', { font: 'Source Sans Pro', fill: '#3399ff', align: 'center' });
			this.waterText.anchor.x = 0.5;
			this.waterText.anchor.y = 0.5;
			this.waterText.setShadow(0, 3, '#005b99', 0);

            this.text = this.game.add.text(this.game.width / 2, this.game.height / 2, '', { font: 'Source Sans Pro', fill: '#ffffff', align: 'center' });
			this.text.anchor.x = 0.5;
			this.text.anchor.y = 0.5;

			this.waterSlotText = this.game.add.text(this.game.width / 2, this.game.height / 3, '', { font: 'Source Sans Pro', fill: '#3399ff', align: 'center' });
			this.waterSlotText.anchor.x = 0.5;
			this.waterSlotText.anchor.y = 0.5;
			this.waterSlotText.setShadow(0, 3, '#005b99', 0);

            this.slotText = this.game.add.text(this.game.width / 2, this.game.height / 3, '', { font: 'Source Sans Pro', fill: '#ffffff', align: 'center' });
			this.slotText.anchor.x = 0.5;
			this.slotText.anchor.y = 0.5;

			this.text.mask = maskGraphics;
			this.slotText.mask = maskGraphics;
		}

		update() {
			this.text.x = this.game.width / 2;
			this.text.y = this.game.height / 2;

			this.waterText.x = this.game.width / 2;
			this.waterText.y = this.game.height / 2;

			this.slotText.x = this.game.width / 2;
			this.slotText.y = this.game.height / 3;

			this.waterSlotText.x = this.game.width / 2;
			this.waterSlotText.y = this.game.height / 3;

			this.text.fontSize = this.game.height / 4;
			this.waterText.fontSize = this.game.height / 4;

			this.slotText.fontSize = this.game.height / 12;
			this.waterSlotText.fontSize = this.game.height / 12;
		}

		setPriceText(price: number) {
			this.text.setText('$' + price.toFixed(2));
			this.waterText.setText('$' + price.toFixed(2));
		}

		setSlotText(currentTotal: number, maxTotal: number) {
			var text = currentTotal + '/' + maxTotal;
			this.slotText.setText(text);
			this.waterSlotText.setText(text);
		}
	}
}