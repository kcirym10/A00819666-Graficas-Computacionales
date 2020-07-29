// JavaScript source code

class Game {
    constructor() {
        this.paused = true;
        this.isNewGame = true;
        this.round = 0;
        this.zombiesPerRound = 24;
        this.zombiesLeft = 0;
        this.activeZombies = 0;

        //Get zombie model
        this.zombieModel = this.getZombieModel();

        //Spawn zombies into game
        this.spawnAreas = [
            new THREE.Vector3(20, 0, -40),      //Front-Right
            new THREE.Vector3(-10, 0, -45),     //Front
            new THREE.Vector3(-40, 0, -35),     //Front-Left
            new THREE.Vector3(-65, 0, 10),      //Left
            new THREE.Vector3(-25, 0, 45),      //Back
            new THREE.Vector3(-5, 0, 45),       //Back-Right
            new THREE.Vector3(15, 0, 20)        //Left
        ];
        this.activeSpawns = 7;
        this.spawnDelay = 1000; //ms
        this.roundDelay = 0;
        this.roundTimer = 0;
        this.spawnTimer = performance.now();
        this.elapsed = 0;
        this.zombies = [];
        //Spawn a new player
        this.player = this.spawnPlayer();

        this.loadGameArea();
        initControls();
    }

    loadGameArea() {

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
        //if (this.paused) {
        //    canvas.hidden = true;
        //}
        //else {
        //    canvas.hidden = false;
        //}
    }

    newGame() {
        this.spawnPlayer();
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
        return player;
    }
    spawnZombie() {

        let time = performance.now();

        if (time - this.spawnTimer >= this.spawnDelay) {
            //console.log(time - this.spawnTimer);

            let zombie = this.zombieModel.clone();
            let pos = this.spawnAreas[Math.floor(Math.random() * this.activeSpawns)];

            zombie.name = "Zombie";
            //zombie.position.set(pos.x, pos.y, pos.z);
            zombie.position.set(0, 0, -10);

            console.log(zombie.position);
            scene.add(zombie);

            ++this.activeZombies;
            this.zombies.push(zombie);
            console.log(zombie);
        }
    }
    newRound() {
        console.log('in')
        this.zombiesLeft = 1;
        this.activeZombies = 0;
        ++this.round;
    }

    update() {
        if (!this.paused) {
            

            //Starts a new round
            if (this.zombiesLeft === 0) {
                this.roundTimer = performance.now();
                this.newRound();
            }

            if (this.activeZombies < 1 && this.zombiesLeft > 0 && performance.now() - this.roundTimer >= this.roundDelay) {
                this.spawnZombie();
            }

            for (let i = 0; i < this.zombies.length; i++)
                this.zombies[0].update();
        }
    }
}
