module WaterSkillGame.Prefabs {
    export class JackpotEntries {
        private currentArray: Array<Models.JackpotEntry>;
        private referenceArray: Array<Models.JackpotEntry>;
        private maxItems: number;
        private avatarDictionary: _.Dictionary<Avatar>;
        private game: Phaser.Game;
        private water: Water;
        private avatarSpriteLoader: AvatarSpriteLoader;
        private avatarGroup: Phaser.Group;

        constructor(game: Phaser.Game, array: Array<Models.JackpotEntry>, maxItems: number, water: Water, avatarSpriteLoader: AvatarSpriteLoader, avatarGroup: Phaser.Group) {
            this.referenceArray = array;
            this.maxItems = maxItems;
            this.avatarDictionary = <_.Dictionary<Avatar>>{};
            this.game = game;
            this.water = water;
            this.avatarSpriteLoader = avatarSpriteLoader;
            this.avatarGroup = avatarGroup;
        }

        update() {
            _.forEach(this.avatarDictionary, avatar => {
                avatar.update();
            });
        }

        checkChanged(): boolean {
            if (this.currentArray == undefined || this.currentArray.length != this.referenceArray.length) {
                this.currentArray = _.cloneDeep(this.referenceArray);
                return true;
            }
            return false;
        }

        calculateLevel(): number {
            return this.referenceArray.length / this.maxItems;
        }

        calculateTotalPrice(): number {
            var sum = 0;
            this.referenceArray.forEach(entry => {
                sum += entry.item.price.value;
            });
            return sum;
        }

        clear() {
            _.forEach(this.avatarDictionary, avatar => {
                avatar.kill();
            });
            this.avatarDictionary = <_.Dictionary<Avatar>>{};
        }

        private createAvatarCountDictionary(): _.Dictionary<number> {
            var dictionary = <_.Dictionary<number>>{};
            this.referenceArray.forEach(entry => {
                var id = entry.user._id || entry.user;

                if (dictionary[id]) {
                    dictionary[id] += entry.item.price.value;
                } else {
                    dictionary[id] = entry.item.price.value;
                }
            });
            return dictionary;
        }

        calculateAvatars() {
            _.forEach(this.avatarDictionary, avatar => {
                avatar.valueOfItems = 0;
            });

            var countDictionary = this.createAvatarCountDictionary();
            _.forEach(countDictionary, (value, key) => {
                var avatar = <Avatar>this.avatarDictionary[key];

                if (avatar) {
                    avatar.valueOfItems = value;
                    avatar.totalPotValue = this.calculateTotalPrice();
                } else {
                    this.loadAvatar(key, value);
                }
            });

            _.forEach(this.avatarDictionary, avatar => {
                avatar.autoScale();
            });
        }

        forEachAvatar(lambda: (avatar: Avatar) => void) {
            _.forEach(this.avatarDictionary, lambda);
        }

        getCount() {
            return this.referenceArray.length;
        }

        private loadAvatar(key: string, value: number) {
            var avatar = new Avatar(this.game, Math.random() * (this.game.width - 150), 100, this.water, this.calculateTotalPrice(), value);
            this.avatarDictionary[key] = avatar;
            this.game.physics.enable([avatar], Phaser.Physics.ARCADE);
            avatar.body.collideWorldBounds = true;
            //this.avatarGroup.add(avatar);
            this.avatarSpriteLoader.loadAvatar(key, () => {
                avatar.loadTexture(key);
            });
        }
    }
}