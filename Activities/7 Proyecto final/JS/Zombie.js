// JavaScript source code
class Zombie extends THREE.Object3D {
    constructor() {
        super();
        this.dimensions = 4.5;
        this.spawnZombie();
    }
    spawnZombie() {
        const that = this;
        //mtlLoader.load(
        //    'Models/zombie.mtl',
        //    function (mat) {
        //        mat.preload();

                //Load object and attatch material
                objLoader
                    //.setMaterials(mat)
                    .load(
                        // resource URL
                        'Models/zombie.obj',
                        // called when resource is loaded
                        function (object) {

                            object.scale.set(that.dimensions, that.dimensions, that.dimensions);
                            object.rotation.set(0, Math.PI, 0);
                            object.position.set(0, 0, 8);
                            scene.add(object);

                        },
                        // called when loading is in progresses
                        function (xhr) {

                            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                        },
                        // called when loading has errors
                        function (error) {

                            console.log('An error happened');

                        });
        //    }
        //);
    }
}
