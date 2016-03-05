module WaterSkillGame.Prefabs {
	export class Winner extends Phaser.Sprite {

		constructor(game: Phaser.Game, x: number, y: number, key: string) {
			super(game, game.width / 2, game.height, key);
			game.add.existing(this);
			this.anchor.x = 0.5;
			this.anchor.y = 1;
			this.z = -10;
		}

		update() {
			this.x = this.game.width / 2;
			this.y = this.game.height;
		}
	}
}