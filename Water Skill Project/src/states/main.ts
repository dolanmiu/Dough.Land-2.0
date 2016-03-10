module WaterSkillGame.States {
    export interface IMainState extends Phaser.State {
        setItemsArray(array: Array<Models.SkillModel>);
        setWaterLevel(level?: number, delay?: number);
    }

    export class MainState extends Phaser.State implements IMainState {

        private graphics: Phaser.Graphics;
        private waterMask: Phaser.Graphics;
        private water: Prefabs.Water;
        private jackpotEntries: Prefabs.JackpotEntries;
        private buoyancyManager: Prefabs.BuoyancyManager;
        private skillPillFactory: Prefabs.SkillPillFactory;
        private waterFactory: Prefabs.WaterFactory;

        private avatarGroup: Phaser.Group;
        private waterGroup: Phaser.Group;
        private winnerGroup: Phaser.Group;

        constructor() {
            super();
        }

        create() {
            this.avatarGroup = this.game.add.group();
            this.waterGroup = this.game.add.group();
            this.winnerGroup = this.game.add.group();

            this.setUpPhysics();
            this.waterFactory = new Prefabs.WaterFactory(this.game);
            this.water = this.waterFactory.newInstance(0.5);

            this.buoyancyManager = new Prefabs.BuoyancyManager(0.09, 0.9);

            this.game.stage.backgroundColor = 0xFFFFFF;
            this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.tweens.frameBased = true;

            this.graphics = this.game.add.graphics(0, 0);
            this.waterMask = new Phaser.Graphics(this.game, 0, 0);

            this.skillPillFactory = new Prefabs.SkillPillFactory(this.game);
            this.game.stateLoadedCallback();

            this.game.scale.onSizeChange.add(() => {
                this.water.setLevel();
            });
            //this.waterGroup.add(this.priceText);
        }

        update() {
            this.waterMask.clear();
            this.graphics.clear();
            this.water.update(this.graphics, this.waterMask);
            this.graphics.endFill();
            this.waterMask.endFill();

            /*this.jackpotEntries.forEachAvatar(avatar => {
                this.buoyancyManager.applyAABBBuoyancyForces(avatar.body, this.water.getWaterLevel(avatar.position.x));
            });*/
        }

        private setUpPhysics() {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 1000;
            this.game.physics.p2.restitution = 0.3;
        }

        setWaterLevel(level?: number, delay?: number) {
            this.water.setLevel(level, delay);
        }

        setItemsArray(array: Array<Models.SkillModel>) {
            array.forEach(skillModel => {
                var skillPill = this.skillPillFactory.newInstance(100, 100, skillModel.skill.name);
                this.game.add.existing(skillPill);
            });
            //this.jackpotEntries = new Prefabs.JackpotEntries(this.game, array, maxItems, this.water, this.avatarSpriteLoader, this.avatarGroup);
            //this.jackpotEntries.calculateAvatars();
            //this.water.setLevel(this.jackpotEntries.calculateLevel());
        }
    }
}