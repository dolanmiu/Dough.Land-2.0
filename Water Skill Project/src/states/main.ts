module WaterSkillGame.States {
    export interface IMainState extends Phaser.State {
        setJackpotItemsArray(array: Array<Models.SkillModel>, maxItems: number);
        setWaterLevel(level?: number, delay?: number);
    }

    export class MainState extends Phaser.State implements IMainState {

        private graphics: Phaser.Graphics;
        private waterMask: Phaser.Graphics;
        private water: Prefabs.Water;
        private jackpotEntries: Prefabs.JackpotEntries;
        private buoyancyManager: Prefabs.BuoyancyManager;
        private priceText: Prefabs.PriceText;
        private avatarSpriteLoader: Prefabs.AvatarSpriteLoader;

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

            this.game.stateLoadedCallback();

            this.game.scale.onSizeChange.add(() => {
                this.water.setLevel();
            });

            this.winnerText = new Prefabs.WinnerText(this.game, this.game.height / 4 * 3);
            this.timerText = new Prefabs.TimerText(this.game, this.waterMask);
            //this.waterGroup.add(this.priceText);
        }

        update() {
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

        private setUpPhysics() {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 1000;
            this.game.physics.p2.restitution = 0.3;
        }

        public setWaterLevel(level?: number, delay?: number) {
            this.water.setLevel(level, delay);
        }

        public setJackpotItemsArray(array: Array<Models.SkillModel>, maxItems: number) {
            this.jackpotEntries = new Prefabs.JackpotEntries(this.game, array, maxItems, this.water, this.avatarSpriteLoader, this.avatarGroup);
            this.jackpotEntries.calculateAvatars();
            this.water.setLevel(this.jackpotEntries.calculateLevel());
        }
    }
}