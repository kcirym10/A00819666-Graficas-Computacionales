// JavaScript source code

class Game {
    constructor() {
        this.paused = true;
        this.isNewGame = true;
        this.round = 1;
        this.enemiesPerRound = 24;
        this.enemiesLeft = 0;
        this.spawns = [
            new THREE.Vector3(0, 0, 0)
        ];
        //Get zombie model
        this.zombieModel = this.getZombieModel();
        //Spawn zombies into game
        this.spawnZombie();
        //Spawn a new player
        this.spawnPlayer();
        this.loadGameArea();
        initControls();
    }

    loadGameArea() {
        canvas.hidden = true;

        //Load material
        //mtlLoader.load(
        //    'Models/mapa.mtl',
        //    function (mat) {
        //        mat.preload();

                //Load object and attatch material
                gltfLoader
                    //.setMaterials(mat)
                    .load(
                        // resource URL
                        'Models/map.glb',
                        // called when resource is loaded
                        function (object) {
                            //object.traverse(function (child) {
                            //    child.object.name = 'map';
                            //    //child.matrixAutoUpdate = false;
                            //});
                            map = object.scene;
                            map.name = "Map";
                            map.scale.set(1.3, 1.3, 1.3);
                            map.rotation.set(0, Math.PI, 0);
                            map.updateMatrixWorld();
                            scene.add(map);
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

        //Add lights to the scene
        //let
        //    spotLights = [
        //        new THREE.SpotLight(0xffffff, 0.5)
        //    ],
        //    positions = [
        //        new THREE.Vector3(-18, 2, 40)
        //    ],
        //    lightDirection = [
        //        new THREE.Vector3(-18, 2, 40)
        //    ];

    }

    togglePause() {
        this.paused = !this.paused;
        //Change necesaries
        if (this.paused) {
            canvas.hidden = true;
        }
        else {
            canvas.hidden = false;
        }
    }

    newGame() {
        this.spawnPlayer();
        this.enemiesLeft = this.enemiesPerRound;
    }

    getZombieModel() {
        let zombie = new Zombie();

        zombie.position.set(0, -10, 0);

        scene.add(zombie);

        return zombie;
    }

    spawnPlayer() {
        player = new Player();
        camera.add(player);
    }
    spawnZombie() {
        let zombie = this.zombieModel.clone();

        zombie.name = "Zombie";
        zombie.position.set(0, 0, -10);

        scene.add(zombie);
        zombie = this.zombieModel.clone();

        zombie.name = "Zombie";
        zombie.position.set(0, 0, -12);
        scene.add(zombie);
    }
}
