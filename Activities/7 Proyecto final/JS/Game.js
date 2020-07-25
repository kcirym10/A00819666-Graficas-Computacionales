// JavaScript source code

class Game {
    constructor() {
        this.paused = true;
        this.round = 1;
        this.enemiesPerRound = 24;
        this.enemiesLeft = 0;
        //this.loadGameArea();
        this.spawnPlayer();
        this.newGame();
    }

    loadGameArea() {
        canvas.hidden = true;

        //Load material
        mtlLoader.load(
            'Models/mapa.mtl',
            function (mat) {
                mat.preload();

                //Load object and attatch material
                objLoader
                    .setMaterials(mat)
                    .load(
                        // resource URL
                        'Models/mapa.obj',
                        // called when resource is loaded
                        function (object) {
                            object.tag = 'map';
                            object.scale.set(1.3, 1.3, 1.3);
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
            }
        );

        //Add lights to the scene
        let
            spotLights = [
                new THREE.SpotLight(0xffffff, 0.5)
            ],
            positions = [
                new THREE.Vector3(-18, 2, 40)
            ],
            lightDirection = [
                new THREE.Vector3(-18, 2, 40)
            ];

        /*for (let i = 0; i < spotLights.length; i++) {
            spotLights[i].position.set(positions[i]);
            spotLights[i].target(lightDirection[i]);
            scene.add(spotLights[i]);
        }*/

    }

    newGame() {

    }

    spawnPlayer() {
        player = new Player();
        scene.add(player);
    }
    spawnZombie() {

    }
}
