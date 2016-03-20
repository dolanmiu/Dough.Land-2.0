module WaterSkillGame.States {
    export interface IMainState extends Phaser.State {
        setItemsArray(array: Array<Models.SkillModel>);
        setWaterLevel(level?: number, delay?: number);
    }

    export class MainState extends Phaser.State implements IMainState {

        private graphics: Phaser.Graphics;
        private water: Prefabs.Water;
        private skillPillFactory: Prefabs.SkillPillFactory;
        private mouseDragHandler: Prefabs.MouseDragHandler;
        private skillPills: Array<Prefabs.SkillPill>;

        private skillPillGroup: Phaser.Group;
        private waterGroup: Phaser.Group;

        constructor() {
            super();
            this.skillPills = new Array<Prefabs.SkillPill>();
        }

        create() {
            this.skillPillGroup = new Phaser.Group(this.game);
            this.waterGroup = new Phaser.Group(this.game);
            this.waterGroup.z = 10;
            this.skillPillGroup.z = 1;

            this.setUpPhysics();

            var waterFactory = new Prefabs.WaterFactory(this.game);
            this.water = waterFactory.newInstance(0.5);
            //this.waterGroup.add(this.water);

            this.game.stage.backgroundColor = 0xF5F5F5;
            this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.tweens.frameBased = true;

            this.graphics = this.game.add.graphics(0, 0);

            this.skillPillFactory = new Prefabs.SkillPillFactory(this.game);

            this.game.scale.onSizeChange.add(() => {
                this.water.setLevel();
            });

            this.mouseDragHandler = new Prefabs.MouseDragHandler(this.game);
            this.game.stateLoadedCallback();
        }

        update() {
            this.graphics.clear();
            this.water.update(this.graphics);
            this.graphics.endFill();

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
            array.forEach(skillModel => {
                var skillPill = this.skillPillFactory.newInstance(100, 100, skillModel.skill.name, 100);
                this.game.add.existing(skillPill);
                this.mouseDragHandler.sprites.push(skillPill);
                this.skillPills.push(skillPill);
                this.skillPillGroup.add(skillPill);
            });
        }
    }
}