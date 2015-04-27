module DoughLand {
    export class CommentFactory {
        private meshCreator: MeshCreator;

        constructor(meshCreator: MeshCreator) {
            this.meshCreator = meshCreator;
        }

        public newInstance(meshPosition: THREE.Vector3, callback: (mesh: THREE.Mesh) => void): void {
            var texture = THREE.ImageUtils.loadTexture('assets/models/parcel.png');
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            var material = new THREE.MeshLambertMaterial({
                map: texture
            });

            this.meshCreator.createMesh('assets/models/parcel.js', material, meshPosition, new THREE.Vector3(5, 5, 5), mesh => {
                callback(mesh);
            });
        }
    }
}