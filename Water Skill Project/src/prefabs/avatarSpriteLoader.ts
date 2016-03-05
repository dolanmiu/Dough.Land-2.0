module WaterSkillGame.Prefabs {
	export class AvatarSpriteLoader extends Phaser.Loader {
		public avatarDictionary: _.Dictionary<boolean>;
        private apiDomain: string;

		constructor(game: Phaser.Game, apiDomain: string) {
			this.avatarDictionary = <_.Dictionary<boolean>>{};
            this.apiDomain = apiDomain;
            super(game);
		}

		loadAvatar(key: string, callback: (key:string) => void) {
			if (this.avatarDictionary[key] == true) {
				callback(key);
				return;
			}
			this.image(key, this.apiDomain + '/api/proxy/' + key + '/avatar', true);
            this.onLoadComplete.addOnce(() => {
				this.avatarDictionary[key] = true;
				callback(key);
            });
            this.start();
		}
	}
}
