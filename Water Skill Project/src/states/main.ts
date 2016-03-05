module WaterSkillGame.States {
    export interface IMainState extends Phaser.State {
        setJackpotItemsArray(array: Array<Models.JackpotEntry>, maxItems: number);
        setWinner(winner: any);
        setTime(time: any);
        setWaterLevel(level?: number, delay?: number);
    }

    export class MainState extends Phaser.State implements IMainState {

        private graphics: Phaser.Graphics;
        private waterMask: Phaser.Graphics;
        private water: Prefabs.Water;
        private jackpotEntries: Prefabs.JackpotEntries;
        private buoyancyManager: Prefabs.BuoyancyManager;
        private priceText: Prefabs.PriceText;
        private maxItems: number;
        private winnerFactory: Prefabs.WinnerFactory;
        private avatarSpriteLoader: Prefabs.AvatarSpriteLoader;
        private winner: Prefabs.Winner;
        private winnerText: Prefabs.WinnerText;
        private timerText: Prefabs.TimerText;
        private avatarGroup: Phaser.Group;
        private waterGroup: Phaser.Group;
        private winnerGroup: Phaser.Group;

        preload() {
            this.game.stage.disableVisibilityChange = true;
        }

        constructor() {
            super();
        }

        create() {
            this.avatarGroup = this.game.add.group();
            this.waterGroup = this.game.add.group();
            this.winnerGroup = this.game.add.group();

            this.setUpPhysics();
            this.water = new Prefabs.Water(this.game, 0);

            this.buoyancyManager = new Prefabs.BuoyancyManager(0.09, 0.9);

            this.game.stage.backgroundColor = 0xFFFFFF;
            this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.tweens.frameBased = true;

            this.graphics = this.game.add.graphics(0, 0);
            this.waterMask = new Phaser.Graphics(this.game, 0, 0);

            this.priceText = new Prefabs.PriceText(this.game, this.waterMask);

            this.avatarSpriteLoader = new Prefabs.AvatarSpriteLoader(this.game, this.game.apiDomain);
            this.avatarSpriteLoader.crossOrigin = "anonymous";
            this.winnerFactory = new Prefabs.WinnerFactory(this.game, this.avatarSpriteLoader, this.winnerGroup);

            this.game.stateLoadedCallback();

            this.game.scale.onSizeChange.add(() => {
                this.water.setLevel();
            });

            this.winnerText = new Prefabs.WinnerText(this.game, this.game.height / 4 * 3);
            this.timerText = new Prefabs.TimerText(this.game, this.waterMask);
            //this.waterGroup.add(this.priceText);
        }

        update() {
            if (this.jackpotEntries && this.jackpotEntries.checkChanged()) {
                this.doChanged();
            }

            this.waterMask.clear();
            this.graphics.clear();
            this.water.update(this.graphics, this.waterMask);
            this.graphics.endFill();
            this.waterMask.endFill();

            this.jackpotEntries.forEachAvatar(avatar => {
                this.buoyancyManager.applyAABBBuoyancyForces(avatar.body, this.water.getWaterLevel(avatar.position.x));
            });

            this.priceText.update();
            this.winnerText.update();
            this.timerText.update();
        }

        private doChanged() {
            this.priceText.setPriceText(this.jackpotEntries.calculateTotalPrice());
            this.priceText.setSlotText(this.jackpotEntries.getCount(), this.maxItems);

            if (this.winner) {
                this.winner.kill();
                this.winnerText.clear();
            }

            if (this.jackpotEntries.getCount() == 0) {
                this.jackpotEntries.clear();
            } else {
                this.jackpotEntries.calculateAvatars();
                this.water.setLevel(this.jackpotEntries.calculateLevel());
            }
        }

        private setUpPhysics() {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 1000;
            this.game.physics.p2.restitution = 0.3;
        }

        public setWaterLevel(level?: number, delay?: number) {
            this.water.setLevel(level, delay);
        }

        public setJackpotItemsArray(array: Array<Models.JackpotEntry>, maxItems: number) {
            this.maxItems = maxItems;
            this.jackpotEntries = new Prefabs.JackpotEntries(this.game, array, maxItems, this.water, this.avatarSpriteLoader, this.avatarGroup);
            this.jackpotEntries.calculateAvatars();
            this.water.setLevel(this.jackpotEntries.calculateLevel());
        }

        public setWinner(winnerJson: any) {
            //this.water.setLevel(1, Phaser.Timer.SECOND * 1);
            this.game.time.events.add(Phaser.Timer.SECOND * 5, () => {
                this.water.splash(this.game.width / 2, 150);
                this.winnerText.slideUp(this.game.height / 3 * 2, Phaser.Timer.SECOND * 2);
            });
            setTimeout(() => {
                this.winnerFactory.newInstance(winnerJson.user._id, winner => {
                    this.winner = winner;
                    this.winnerText.text = winnerJson.user.name + ' won with ' + (winnerJson.chance * 100).toFixed(2) + '% chance';
                });
            }, Phaser.Timer.SECOND * 2);
            this.timerText.hardReset();
        }

        public setTime(time: number) {
            this.timerText.setTime(time);
        }
    }
}