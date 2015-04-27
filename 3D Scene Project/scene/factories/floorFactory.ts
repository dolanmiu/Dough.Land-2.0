module DoughLand {
    export class FloorFactory {
        private meshCreator: MeshCreator;

        constructor(meshCreator: MeshCreator) {
            this.meshCreator = meshCreator;
        }

        public newInstance(meshPosition: THREE.Vector3, callback: (mesh: THREE.Mesh) => void): void {
            var texture = THREE.ImageUtils.loadTexture('assets/models/boxFloor.png');
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            var material = new THREE.MeshLambertMaterial({
                map: texture
            });

            this.meshCreator.createMesh('assets/models/boxfloor.js', material, meshPosition, new THREE.Vector3(50, 50, 50), mesh => {
                callback(mesh);
            });
        }
    }
}