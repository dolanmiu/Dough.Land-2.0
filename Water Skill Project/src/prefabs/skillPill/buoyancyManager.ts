module WaterSkillGame.Prefabs {
    export class BuoyancyManager {
        private liftForce: Phaser.Point = new Phaser.Point();
        private k: number = 100; // up force per submerged "volume"
        private c: number = 0.8; // viscosity
        private v = [0, 0];

        constructor(k: number, c: number) {
            this.k = k;
            this.c = c;
        }

        applyAABBBuoyancyForces(body: Phaser.Physics.P2.Body, planePosition: Phaser.Point) {
            var centerOfBuoyancy = new Phaser.Point();

            // Get shape AABB
            var bounds = body.sprite.getBounds();
            var areaUnderWater: number;

            if (bounds.y > planePosition.y) {
                // Fully submerged
                centerOfBuoyancy = body.sprite.position;
                areaUnderWater = body.sprite.width * body.sprite.height;
            } else if (bounds.y + bounds.height > planePosition.y) {
                // Partially submerged
                var width = bounds.width;
                var height = Math.abs(bounds.y - planePosition.y);
                //areaUnderWater = width * height;
                areaUnderWater = body.sprite.width * body.sprite.height;
                centerOfBuoyancy = body.sprite.position;
                //var ratioOutOfWater = (planePosition.y - bounds.y) / bounds.height;
                //centerOfBuoyancy.x = bounds.x + width / 2;
                //centerOfBuoyancy.y = bounds.y + (height / 2) + (height / 2 * ratioOutOfWater);
            } else {
                body.angularDamping = 0.1;
                return;
            }

            // Compute lift force
            this.liftForce = Phaser.Point.subtract(centerOfBuoyancy, planePosition);
            //console.log(this.liftForce.y);
            //console.log(areaUnderWater);
            //this.liftForce.setMagnitude(areaUnderWater * this.k);

            // Make center of bouycancy relative to the body
            centerOfBuoyancy = Phaser.Point.subtract(centerOfBuoyancy, body.sprite.position);

            // Apply forces
            body.velocity.x = body.velocity.x * this.c;
            body.velocity.y = body.velocity.y * this.c;
            body.angularDamping = 0.9;
            //body.applyForce([this.viscousForce.x, this.viscousForce.y], centerOfBuoyancy.x, centerOfBuoyancy.y);
            //console.log(areaUnderWater);
            if (this.liftForce.y > 0) {
                body.applyForce([0, this.liftForce.y], centerOfBuoyancy.x, centerOfBuoyancy.y);
            }
        }
    }
}