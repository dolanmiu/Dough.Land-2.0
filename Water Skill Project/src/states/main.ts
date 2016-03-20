module WaterSkillGame.States {
    export interface IMainState extends Phaser.State {
        setItemsArray(array: Array<Models.SkillModel>);
        setWaterLevel(level?: number, delay?: number);
    }

    export class MainState extends Phaser.State implements IMainState {

        private graphics: Phaser.Graphics;
        private waterMask: Phaser.Graphics;
        private water: Prefabs.Water;
        private skillPillFactory: Prefabs.SkillPillFactory;
        private mouseDragHandler: Prefabs.MouseDragHandler;
        private skillPills: Array<Prefabs.SkillPill>;

        private avatarGroup: Phaser.Group;
        private waterGroup: Phaser.Group;
        private winnerGroup: Phaser.Group;

        constructor() {
            super();
            this.skillPills = new Array<Prefabs.SkillPill>();
        }

        create() {
            this.avatarGroup = this.game.add.group();
            this.waterGroup = this.game.add.group();
            this.winnerGroup = this.game.add.group();

            this.setUpPhysics();

            var waterFactory = new Prefabs.WaterFactory(this.game);
            this.water = waterFactory.newInstance(0.5);


            //this.game.stage.backgroundColor = 0xFFFFFF;
            this.game.stage.backgroundColor = 0xF5F5F5;
            this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.tweens.frameBased = true;

            this.graphics = this.game.add.graphics(0, 0);
            this.waterMask = new Phaser.Graphics(this.game, 0, 0);

            this.skillPillFactory = new Prefabs.SkillPillFactory(this.game);

            this.game.scale.onSizeChange.add(() => {
                this.water.setLevel();
            });

            this.mouseDragHandler = new Prefabs.MouseDragHandler(this.game);
            //this.waterGroup.add(this.priceText);
            this.game.stateLoadedCallback();
        }

        update() {
            this.waterMask.clear();
            this.graphics.clear();
            this.water.update(this.graphics, this.waterMask);
            this.graphics.endFill();
            this.waterMask.endFill();

            this.skillPills.forEach(skillPill => {
                skillPill.updatePhysics(this.water.getWaterLevel(skillPill.position.x), this.water);
            });
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
            array = array.slice(0, 1);
            array.forEach(skillModel => {
                var skillPill = this.skillPillFactory.newInstance(100, 100, skillModel.skill.name, 100);
                this.game.add.existing(skillPill);
                this.mouseDragHandler.sprites.push(skillPill);
                this.skillPills.push(skillPill);
            });
            //this.water.setLevel(this.jackpotEntries.calculateLevel());
        }
    }
}